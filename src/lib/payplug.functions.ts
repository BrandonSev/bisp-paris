import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

const PAYPLUG_API = 'https://api.payplug.com/v1/payments';

export const createPayplugPayment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        orderId: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.PAYPLUG_SECRET_KEY;
    if (!apiKey) throw new Error('PayPlug non configuré');

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', data.orderId)
      .eq('user_id', userId)
      .single();
    if (error || !order) throw new Error('Commande introuvable');
    if (order.payment_status === 'paid') {
      throw new Error('Commande déjà payée');
    }

    const origin = process.env.PUBLIC_APP_URL || 'https://id-preview--fa096424-5c0e-41e8-b125-a87209e9237c.lovable.app';

    const body = {
      amount: Math.round(Number(order.total_amount) * 100),
      currency: 'EUR',
      customer: {
        email: order.family_email,
        first_name: (order.family_prenom || '').slice(0, 100) || 'Client',
        last_name: (order.family_nom || '').slice(0, 100) || 'BISP',
      },
      hosted_payment: {
        return_url: `${origin}/paiement/succes?order=${order.id}`,
        cancel_url: `${origin}/paiement/echec?order=${order.id}`,
      },
      notification_url: `${origin}/api/public/payplug/webhook`,
      metadata: { order_id: order.id, order_number: order.order_number, user_id: userId },
    };

    const res = await fetch(PAYPLUG_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'PayPlug-Version': '2019-08-06',
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as any;
    if (!res.ok) {
      console.error('PayPlug create failed', json);
      throw new Error(json?.message || 'Erreur PayPlug');
    }

    await supabase
      .from('orders')
      .update({
        payment_provider: 'payplug',
        payment_id: json.id,
        payment_status: 'pending',
        payment_method: 'cb_payplug',
      })
      .eq('id', order.id);

    return {
      paymentUrl: json.hosted_payment?.payment_url as string,
      paymentId: json.id as string,
    };
  });

export const setOrderPaymentMethod = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        orderId: z.string().uuid(),
        method: z.enum(['cb_payplug', 'cheque', 'virement', 'especes']),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from('orders')
      .update({ payment_method: data.method })
      .eq('id', data.orderId)
      .eq('user_id', userId);
    if (error) throw error;
    return { ok: true };
  });