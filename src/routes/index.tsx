import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard, ShieldCheck, Truck } from "lucide-react";
import logo from "@/assets/bisp-logo.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BISP — Boutique officielle des uniformes · Bilingual International School of Paris" },
      {
        name: "description",
        content:
          "Espace familles BISP. Commandez les uniformes officiels du Bilingual International School of Paris (15ᵉ) — polos, pulls, chemises, trousses brodés à l'écusson de l'école.",
      },
      { property: "og:title", content: "BISP — Boutique officielle des uniformes" },
      {
        property: "og:description",
        content: "Family portal · Commandez les uniformes officiels brodés de l'écusson BISP.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top utility bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span className="hidden sm:inline">Simply exceptional · Brodé sur mesure pour BISP</span>
          <div className="flex items-center gap-4">
            <span>FR</span>
            <span className="text-border">·</span>
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="BISP" className="h-12 w-12 object-contain" />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight text-primary">
                Bilingual International School of Paris
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Boutique officielle · Official shop
              </div>
            </div>
          </div>
          <Link
            to="/login"
            className="hidden h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            Espace familles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-background px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative grid grid-cols-1 overflow-hidden border border-white/5 bg-primary text-white shadow-2xl lg:grid-cols-2">
            {/* Left: Heritage seal */}
            <div className="relative flex flex-col items-center justify-center border-b border-white/10 p-12 lg:border-b-0 lg:border-r lg:p-20">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-deep to-primary" aria-hidden />
              <div
                className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-[var(--rouge)]/40"
                aria-hidden
              />
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src={logo}
                  alt="Écusson BISP"
                  className="h-56 w-56 object-contain drop-shadow-2xl sm:h-64 sm:w-64 lg:h-72 lg:w-72"
                  loading="eager"
                />
                <div className="mt-10 space-y-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--rouge)]">
                    Simply Exceptional
                  </span>
                  <div className="mx-auto h-px w-12 bg-white/20" />
                  <p className="text-[11px] font-light uppercase tracking-[0.25em] text-white/60">
                    Établissement Bilingue · Paris XV
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Boutique portal */}
            <div className="relative flex flex-col justify-center bg-primary-deep p-10 lg:p-20">
              <div className="relative z-10 max-w-md">
                <div className="mb-8 inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-[var(--rouge)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
                    Official School Shop
                  </span>
                </div>

                <h1
                  className="mb-8 text-4xl font-normal leading-[1.05] sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Boutique officielle
                  <br />
                  <span className="italic text-white/75">des uniformes</span>
                </h1>

                <p className="text-base font-light leading-relaxed text-white/85 sm:text-lg">
                  Bilingual International School of Paris · 15ᵉ. Commandez les tenues officielles brodées de l'écusson
                  BISP pour la maternelle, l'élémentaire et le collège.
                </p>
                <p className="mt-4 text-sm font-light italic leading-relaxed text-white/55">
                  Order your official BISP school uniforms — featuring the embroidered crest and premium quality fabrics
                  for the new academic year.
                </p>

                <div className="mt-12 flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-3 bg-[var(--rouge)] px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-colors duration-300 hover:bg-white hover:text-primary"
                  >
                    Accéder à la boutique
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.25em]">
                    <span className="text-[var(--rouge)]">FR</span>
                    <span className="h-4 w-px bg-white/15" />
                    <span className="text-white/40">EN</span>
                  </div>
                </div>
              </div>

              {/* Decorative watermark */}
              <div
                className="pointer-events-none absolute bottom-6 right-6 select-none text-[120px] italic leading-none text-white/[0.04] lg:text-[160px]"
                style={{ fontFamily: "'Playfair Display', serif" }}
                aria-hidden
              >
                BISP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA boutique */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
            <span className="h-px w-8 bg-[var(--teal)]" /> Boutique · Shop
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tous les uniformes officiels
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Polos, pulls, chemises, t-shirts et accessoires brodés de l'écusson BISP.
          </p>
          <Link
            to="/boutique"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xl transition-all hover:gap-3 hover:bg-primary/90"
          >
            Découvrir la boutique <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <TrustItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Tenues validées par l'établissement"
            text="Chaque produit est référencé en accord avec la direction de BISP et brodé de l'écusson officiel."
          />
          <TrustItem
            icon={<Truck className="h-5 w-5" />}
            title="Livraison à l'école pour la rentrée"
            text="Pour la rentrée 2026, vos commandes sont remises à votre enfant à l'école ou expédiées à votre domicile à partir d'octobre 2026."
          />
          <TrustItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Qualité premium"
            text="Tissus durables sélectionnés pour résister au rythme de l'école, de la maternelle au collège."
          />
          <TrustItem
            icon={<CreditCard className="h-5 w-5" />}
            title="Paiement en ligne sécurisé"
            text="Réglez vos commandes en toute confiance par carte bancaire via notre prestataire certifié."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} France Uniformes · Tous droits réservés</span>
          <span>boutique@franceuniformes.fr · Paiement sécurisé</span>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-center">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
