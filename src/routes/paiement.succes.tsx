import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/SiteHeader';

export const Route = createFileRoute('/paiement/succes')({
  head: () => ({ meta: [{ title: 'Paiement réussi · Payment success — BISP' }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const orderId = search?.get('order');
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">Paiement réussi</h1>
        <p className="mt-2 text-sm italic text-muted-foreground">Payment successful</p>
        <p className="mt-4 max-w-md text-sm text-foreground/80">
          Merci ! Votre commande a bien été enregistrée. Vous recevrez une confirmation par email sous quelques minutes.
        </p>
        {orderId && (
          <p className="mt-2 text-xs text-muted-foreground">Référence : {orderId}</p>
        )}
        <div className="mt-8 flex gap-3">
          <Link to="/commandes" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Mes commandes
          </Link>
          <Link to="/boutique" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary">
            Continuer · Continue
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}