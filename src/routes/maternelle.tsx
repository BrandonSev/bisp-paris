import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import poloMockup from "@/assets/polo-bisp-mockup.jpeg";
import polo from "@/assets/polo-bisp.jpg";
import classeBisp from "@/assets/classe-bisp.jpg";
import trousses from "@/assets/trousses-bisp.png";

export const Route = createFileRoute("/maternelle")({
  head: () => ({
    meta: [
      { title: "Polo officiel BISP — Maternelle & Élémentaire" },
      {
        name: "description",
        content:
          "Polo blanc officiel brodé de l'écusson BISP, porté au quotidien par les élèves de maternelle et d'élémentaire.",
      },
    ],
  }),
  component: MaternellePage,
});

const sizes = ["3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans"];

function MaternellePage() {
  const [size, setSize] = useState("6 ans");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const gallery = [poloMockup, polo, classeBisp];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" cartCount={0} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link to="/niveau" className="hover:text-primary">Boutique</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Maternelle & Élémentaire (PS → CM2)</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Polo officiel</span>
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-0 top-0 -z-0 h-96 w-96 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.03} />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-border bg-secondary">
              <img
                src={gallery[activeImg]}
                alt="Polo officiel BISP"
                className="aspect-square w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`overflow-hidden rounded-xl border-2 transition-all ${
                    activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Trousses cross-sell */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[var(--teal)]/10 to-transparent p-5">
              <div className="flex items-center gap-4">
                <img src={trousses} alt="Trousses BISP" className="h-20 w-24 object-contain" loading="lazy" />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
                    Aussi disponible · Also available
                  </div>
                  <div className="mt-1 font-semibold text-foreground">Trousses brodées BISP</div>
                  <div className="text-xs text-muted-foreground">À partir de 18,00 €</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              <ShieldCheck className="h-3 w-3" /> Tenue officielle BISP
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Polo officiel — Maternelle & Élémentaire
            </h1>
            <p className="mt-1 text-sm italic text-muted-foreground">
              Official polo · Kindergarten & Primary
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Réf. BISP-POLO-PRI-2026
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-foreground">28,00 €</span>
              <span className="rounded-md bg-[var(--rouge)]/15 px-2 py-0.5 text-xs font-medium text-[var(--rouge)]">
                Tarif famille · Family price
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-foreground/80">
              Polo blanc officiel BISP — porté au quotidien par les élèves. Coton piqué blanc
              <strong> #FFFFFF</strong>, col bleu marine #1F2E59, écusson brodé poitrine fidèle
              à la charte (bleu marine + teal). Liseré tricolore en bas de manche.
              Confection soignée pour un usage quotidien.
            </p>
            <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
              White piqué cotton polo with embroidered BISP crest. Comfortable, durable, daily wear.
            </p>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Taille · Size</label>
                <button className="text-xs text-[var(--teal-deep)] hover:underline">Guide des tailles</button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="mt-8 flex items-stretch gap-3">
              <div className="inline-flex h-14 items-center rounded-xl border border-border bg-card">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-full w-12 items-center justify-center text-muted-foreground hover:text-foreground">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-base font-semibold text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="flex h-full w-12 items-center justify-center text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:bg-primary/90">
                Ajouter au panier · Add to cart
              </button>
              <button className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-[var(--rouge)]">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
              <Bullet icon={<Truck className="h-4 w-4" />} text="Livraison à l'école sous 5–7 jours" />
              <Bullet icon={<ShieldCheck className="h-4 w-4" />} text="Échange de taille gratuit 30 jours" />
              <Bullet icon={<Check className="h-4 w-4" />} text="Coton certifié OEKO-TEX" />
              <Bullet icon={<Check className="h-4 w-4" />} text="Écusson brodé officiel" />
            </div>
          </div>
        </div>

        {/* Description bloc */}
        <div className="mt-16 rounded-3xl bg-secondary p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--teal-deep)]">
                Détails · Details
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Pensé pour le quotidien
                <br />
                <span className="italic font-light text-foreground/70">Made for everyday school life</span>
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/80 lg:col-span-2">
              <p>
                Le polo BISP est porté par tous les élèves de la maternelle au CM2. Sa coupe
                confortable permet une grande liberté de mouvement et son écusson brodé garantit
                une durabilité supérieure aux impressions.
              </p>
              <p>
                Tissu résistant, lavable en machine à 40°C, séchage rapide. Couleurs fidèles à
                la charte BISP (Bleu marine #1F2E59, Teal #348397).
              </p>
              <p className="italic text-muted-foreground">
                Quality piqué cotton, machine washable at 40°C. Embroidered BISP crest in
                authentic charter colours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Bullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--teal)]/15 text-[var(--teal-deep)]">
        {icon}
      </span>
      {text}
    </div>
  );
}
