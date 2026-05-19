import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, ShieldCheck, Truck, GraduationCap, Globe2, Sparkles } from "lucide-react";
import logo from "@/assets/bisp-logo.svg";
import classeBisp from "@/assets/classe-bisp.jpg";
import { WaveMotif, ShellMotif } from "@/components/SchoolMotif";
import { SiteFooter } from "@/components/SiteHeader";

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
              <div className="text-base font-semibold tracking-tight text-primary">Bilingual International School of Paris</div>
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 -z-10 opacity-25 mix-blend-overlay">
          <img src={classeBisp} alt="" className="h-full w-full object-cover" loading="eager" />
        </div>
        <div className="absolute inset-0 -z-10 bg-primary-deep/70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-deep/85 via-primary-deep/60 to-primary-deep/30" />
        <div className="pointer-events-none absolute inset-0 -z-10 text-white">
          <ShellMotif className="absolute -left-40 -top-32 h-[700px] w-[700px]" opacity={0.08} />
          <ShellMotif className="absolute -right-48 -bottom-48 h-[700px] w-[700px]" opacity={0.06} />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-primary">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" /> Family portal · Espace officiel
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
                Boutique officielle
                <br />
                des uniformes
              </h1>
              <div className="mt-5 h-1 w-20 rounded-full bg-[var(--rouge)] mx-auto lg:mx-0" />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg mx-auto lg:mx-0">
                Bilingual International School of Paris · 15ᵉ. Commandez les tenues officielles brodées de l'écusson
                BISP pour la maternelle, l'élémentaire et le collège.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 italic mx-auto lg:mx-0">
                Order your official BISP school uniforms — embroidered crest, quality fabrics, ready for the new school
                year.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary shadow-xl transition-all hover:gap-3 hover:bg-white/95"
                >
                  Accéder à la boutique <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/boutique"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Voir les uniformes
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
                <HeroStat icon={<GraduationCap className="h-4 w-4" />} value="PS → Terminal" label="Niveaux" />
                <HeroStat icon={<Globe2 className="h-4 w-4" />} value="FR / EN" label="Bilingue" />
                <HeroStat icon={<Sparkles className="h-4 w-4" />} value="2026" label="Rentrée" />
              </div>
            </div>

            {/* Right : framed crest */}
            <div className="relative hidden lg:block">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur">
                <div className="flex aspect-[4/5] flex-col items-center justify-center p-12">
                  <img
                    src={logo}
                    alt="Écusson BISP"
                    className="h-72 w-72 object-contain drop-shadow-2xl"
                    loading="eager"
                  />
                  <div className="mt-8 text-center">
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
                      Écusson officiel · Official crest
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold text-white italic">Simply exceptional</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-2xl border-2 border-[var(--rouge)] bg-white/10 backdrop-blur" />
              <div className="absolute -left-3 bottom-10 h-12 w-12 rounded-full bg-[var(--rouge)]" />
            </div>
          </div>
        </div>

        {/* wave bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 text-background">
          <WaveMotif className="h-full w-full" opacity={1} />
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Écusson brodé officiel"
            text="Toutes les tenues portent l'écusson brodé fidèle à la charte BISP."
            sub="Official embroidered crest"
          />
          <TrustItem
            icon={<Truck className="h-5 w-5" />}
            title="Livraison à l'école"
            text="Pour la rentrée 2026, vos commandes sont remises à votre enfant à l'école ou expédiées à votre domicile à partir d'octobre 2026."
            sub="Delivered to school or home"
          />
          <TrustItem
            icon={<MapPin className="h-5 w-5" />}
            title="Paris 15ᵉ"
            text="Boutique officielle de l'école BISP, Paris 15ᵉ arrondissement."
            sub="Official Paris 15 shop"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function TrustItem({ icon, title, text, sub }: { icon: React.ReactNode; title: string; text: string; sub: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--teal)]/15 text-[var(--teal-deep)]">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
        <p className="mt-0.5 text-xs italic text-muted-foreground/70">{sub}</p>
      </div>
    </div>
  );
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-left backdrop-blur">
      <div className="flex items-center gap-1.5 text-white/70">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
