import { createFileRoute } from '@tanstack/react-router';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import * as React from 'react';
import { render } from '@react-email/components';
import { TEMPLATES } from '@/lib/email-templates/registry';

const SITE_NAME = 'BISP Paris';
const SENDER_DOMAIN = 'notify.franceuniformes.fr';
const FROM_DOMAIN = 'notify.franceuniformes.fr';

async function sendOrderPaidEmail(orderId: string) {
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, total_amount, family_email, family_prenom, family_nom')
    .eq('id', orderId)
    .maybeSingle();
  if (!order?.family_email) return;

  const entry = TEMPLATES['order-status'];
  if (!entry) return;
  const data = {
    prenom: order.family_prenom,
    familyName: order.family_nom,
    orderNumber: order.order_number,
    status: 'Paiement validé',
  };
  const element = React.createElement(entry.component, data);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject = typeof entry.subject === 'function' ? entry.subject(data) : entry.subject;
  const messageId = `order-paid-${order.id}`;

  // Idempotency: skip if already enqueued/sent
  const { data: existing } = await supabaseAdmin
    .from('email_send_log')
    .select('id')
    .eq('message_id', messageId)
    .limit(1)
    .maybeSingle();
  if (existing) return;

  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: 'order-status',
    recipient_email: order.family_email,
    status: 'pending',
  });

  await supabaseAdmin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: order.family_email,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: 'order-status',
      idempotency_key: messageId,
      queued_at: new Date().toISOString(),
    },
  });
}

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

        const update: {
          payment_status?: string;
          paid_at?: string;
          status?: string;
        } = {};
        if (isPaid) {
          update.payment_status = 'paid';
          update.paid_at = new Date().toISOString();
          update.status = 'Payée';
        } else if (failure) {
          update.payment_status = 'failed';
        } else {
          update.payment_status = 'pending';
        }

        const query = supabaseAdmin.from('orders').update(update as never);
        const { error } = orderId
          ? await query.eq('id', orderId)
          : await query.eq('payment_id', paymentId!);

        if (error) {
          console.error('Webhook update failed', error);
          return new Response('DB error', { status: 500 });
        }

        // Send payment confirmation email (fire-and-forget; do not fail webhook on email errors)
        if (isPaid) {
          let resolvedOrderId = orderId;
          if (!resolvedOrderId && paymentId) {
            const { data: o } = await supabaseAdmin
              .from('orders')
              .select('id')
              .eq('payment_id', paymentId)
              .maybeSingle();
            resolvedOrderId = o?.id;
          }
          if (resolvedOrderId) {
            try {
              await sendOrderPaidEmail(resolvedOrderId);
            } catch (e) {
              console.error('order-paid email failed', e);
            }
          }
        }

        return new Response('ok');
      },
    },
  },
});