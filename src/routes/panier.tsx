import { createFileRoute, Link } from "@tanstack/react-router";
import { Hammer, ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [{ title: "Mon panier · My cart — BISP" }],
  }),
  component: () => (
    <RequireAuth>
      <PanierWIP />
    </RequireAuth>
  ),
});

function PanierWIP() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--teal)]/10 text-[var(--teal-deep)]">
            <Hammer className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Panier en cours de construction
          </h1>
          <p className="mt-2 text-sm italic text-muted-foreground">
            Cart under construction
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Cette page est temporairement désactivée. Les tarifs et le tunnel de
            commande seront disponibles dès la validation du projet par l'école.
          </p>
          <Link
            to="/boutique"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la boutique
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
