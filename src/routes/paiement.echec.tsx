import { createFileRoute, Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/SiteHeader';

export const Route = createFileRoute('/paiement/echec')({
  head: () => ({ meta: [{ title: 'Paiement annulé · Payment cancelled — BISP' }] }),
  component: FailPage,
});

function FailPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700">
          <XCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">Paiement annulé</h1>
        <p className="mt-2 text-sm italic text-muted-foreground">Payment cancelled</p>
        <p className="mt-4 max-w-md text-sm text-foreground/80">
          Votre commande est enregistrée mais n'a pas été payée. Vous pouvez relancer le paiement depuis votre espace commandes.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/commandes" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Mes commandes
          </Link>
          <Link to="/panier" className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary">
            Retour au panier
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}