import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import lycee from "@/assets/lycee-bisp.jpg";

export const Route = createFileRoute("/lycee")({
  head: () => ({
    meta: [{ title: "Lycée · High school — BISP" }],
  }),
  component: LyceePage,
});

function LyceePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link to="/niveau" className="hover:text-primary">Boutique</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Lycée · High school</span>
        </div>
      </div>
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-3xl border border-border">
          <img src={lycee} alt="Lycéens BISP" className="aspect-[16/9] w-full object-cover" loading="lazy" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
          <ShieldCheck className="h-3 w-3" /> Bientôt · Coming soon
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Uniformes lycée — Bientôt
        </h1>
        <p className="mt-1 text-sm italic text-muted-foreground">High school uniforms coming soon</p>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          BISP n'a pas encore de section lycée. Les familles seront informées par email
          dès qu'une sélection sera proposée.
        </p>
        <Link
          to="/niveau"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-muted"
        >
          Retour à la boutique
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}
