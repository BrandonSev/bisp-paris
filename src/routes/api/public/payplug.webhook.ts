import { createFileRoute } from '@tanstack/react-router';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/public/payplug/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.PAYPLUG_SECRET_KEY;
        if (!apiKey) {
          return new Response('Misconfigured', { status: 500 });
        }

        const body = await request.text();
        const signature = request.headers.get('payplug-signature') || request.headers.get('PayPlug-Signature');

        // Signature: HMAC-SHA256 hex of body using secret key
        if (signature) {
          try {
            const expected = createHmac('sha256', apiKey).update(body).digest('hex');
            const a = Buffer.from(signature.trim(), 'utf8');
            const b = Buffer.from(expected, 'utf8');
            if (a.length !== b.length || !timingSafeEqual(a, b)) {
              return new Response('Invalid signature', { status: 401 });
            }
          } catch {
            return new Response('Invalid signature', { status: 401 });
          }
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response('Bad payload', { status: 400 });
        }

        const paymentId: string | undefined = payload?.id;
        const isPaid = payload?.is_paid === true || payload?.object === 'payment' && payload?.is_paid === true;
        const failure = payload?.failure;
        const orderId: string | undefined = payload?.metadata?.order_id;

        if (!paymentId && !orderId) {
          return new Response('No reference', { status: 400 });
        }

        const update: Record<string, any> = {};
        if (isPaid) {
          update.payment_status = 'paid';
          update.paid_at = new Date().toISOString();
          update.status = 'Payée';
        } else if (failure) {
          update.payment_status = 'failed';
        } else {
          update.payment_status = 'pending';
        }

        const query = supabaseAdmin.from('orders').update(update);
        const { error } = orderId
          ? await query.eq('id', orderId)
          : await query.eq('payment_id', paymentId!);

        if (error) {
          console.error('Webhook update failed', error);
          return new Response('DB error', { status: 500 });
        }

        return new Response('ok');
      },
    },
  },
});