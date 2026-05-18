import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SiteHeader, SiteFooter } from '@/components/SiteHeader'
import { Button } from '@/components/ui/button'

type SearchParams = { token?: string }

export const Route = createFileRoute('/unsubscribe')({
  head: () => ({ meta: [{ title: 'Désinscription · Unsubscribe — BISP' }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    token: typeof s.token === 'string' ? s.token : undefined,
  }),
  component: UnsubscribePage,
})

type State =
  | { kind: 'loading' }
  | { kind: 'no_token' }
  | { kind: 'invalid' }
  | { kind: 'already' }
  | { kind: 'valid' }
  | { kind: 'success' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }

function UnsubscribePage() {
  const { token } = useSearch({ from: '/unsubscribe' })
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    if (!token) {
      setState({ kind: 'no_token' })
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (r.status === 404) return setState({ kind: 'invalid' })
        const data = await r.json()
        if (data.valid) setState({ kind: 'valid' })
        else if (data.reason === 'already_unsubscribed') setState({ kind: 'already' })
        else setState({ kind: 'invalid' })
      })
      .catch(() => setState({ kind: 'error', message: 'Network error' }))
  }, [token])

  const confirm = async () => {
    if (!token) return
    setState({ kind: 'submitting' })
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await r.json()
      if (data.success) setState({ kind: 'success' })
      else if (data.reason === 'already_unsubscribed') setState({ kind: 'already' })
      else setState({ kind: 'error', message: data.error ?? 'Échec de la désinscription' })
    } catch {
      setState({ kind: 'error', message: 'Network error' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Désinscription · Unsubscribe
        </h1>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          {state.kind === 'loading' && <p className="text-sm text-muted-foreground">Vérification du lien…</p>}
          {state.kind === 'no_token' && <p className="text-sm text-destructive">Lien invalide : aucun jeton fourni.</p>}
          {state.kind === 'invalid' && <p className="text-sm text-destructive">Ce lien de désinscription est invalide ou a expiré.</p>}
          {state.kind === 'already' && (
            <p className="text-sm text-foreground">Vous êtes déjà désinscrit(e). Vous ne recevrez plus nos emails.</p>
          )}
          {state.kind === 'valid' && (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Cliquez ci-dessous pour confirmer votre désinscription des emails BISP.
              </p>
              <Button onClick={confirm}>Confirmer la désinscription</Button>
            </div>
          )}
          {state.kind === 'submitting' && <p className="text-sm text-muted-foreground">Traitement…</p>}
          {state.kind === 'success' && (
            <p className="text-sm text-foreground">
              C'est fait. Vous ne recevrez plus nos emails.
            </p>
          )}
          {state.kind === 'error' && <p className="text-sm text-destructive">{state.message}</p>}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}