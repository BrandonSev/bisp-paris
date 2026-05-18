import { supabase } from '@/integrations/supabase/client'

interface SendTransactionalEmailParams {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, any>
}

/**
 * Trigger a transactional email via the internal send route.
 * Requires an authenticated Supabase session (user JWT).
 * Failures are logged but do not throw — UI flow must not block on email.
 */
export async function sendTransactionalEmail(params: SendTransactionalEmailParams) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.warn('sendTransactionalEmail: no session, skipping', params.templateName)
      return { skipped: true }
    }
    const res = await fetch('/lovable/email/transactional/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        templateName: params.templateName,
        recipientEmail: params.recipientEmail,
        idempotencyKey: params.idempotencyKey,
        templateData: params.templateData,
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('sendTransactionalEmail failed', res.status, text)
      return { ok: false, status: res.status }
    }
    return await res.json()
  } catch (err) {
    console.error('sendTransactionalEmail error', err)
    return { ok: false, error: err }
  }
}