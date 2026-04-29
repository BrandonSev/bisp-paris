import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import polo from "@/assets/polo-bisp.jpg";
import pull from "@/assets/pull-bisp.jpg";
import tshirt from "@/assets/tshirt-bisp.jpg";
import chemise from "@/assets/chemise-bisp.jpg";
import chemiseFille from "@/assets/chemise-bisp-fille.png";
import trousses from "@/assets/trousses-bisp.png";
import collegeBisp from "@/assets/college-bisp.jpg";

export const Route = createFileRoute("/college")({
  head: () => ({
    meta: [
      { title: "Uniformes Collège · Middle school — BISP" },
      {
        name: "description",
        content:
          "Polos, pulls, chemises, t-shirts et trousses brodés BISP pour les collégiens du Bilingual School of Paris.",
      },
    ],
  }),
  component: CollegePage,
});

const sizes = ["10 ans", "12 ans", "14 ans", "16 ans", "S", "M", "L"];

const products = [
  {
    id: "polo",
    name: "Polo blanc officiel",
    nameEn: "Official white polo",
    ref: "BISP-POLO-001",
    price: 28.0,
    image: polo,
    tag: "Best-seller",
    desc: "Polo blanc piqué de coton, écusson brodé poitrine BISP, col bleu marine #1F2E59.",
  },
  {
    id: "pull",
    name: "Pull col V bleu marine",
    nameEn: "Navy V-neck jumper",
    ref: "BISP-PULL-002",
    price: 48.0,
    image: pull,
    tag: "Hiver",
    desc: "Pull col V bleu marine #1F2E59, maille douce, écusson brodé poitrine.",
  },
  {
    id: "chemise",
    name: "Chemise blanche garçon",
    nameEn: "White boys shirt",
    ref: "BISP-SHIRT-G",
    price: 32.0,
    image: chemise,
    tag: "Cérémonie",
    desc: "Chemise blanche manches longues, coton tissé, écusson brodé discret.",
  },
  {
    id: "chemise-fille",
    name: "Chemise blanche fille",
    nameEn: "White girls blouse",
    ref: "BISP-SHIRT-F",
    price: 34.0,
    image: chemiseFille,
    tag: "Fille",
    desc: "Chemisier blanc cintré, pinces poitrine et dos, finition couture soignée.",
  },
  {
    id: "tshirt",
    name: "T-shirt sport BISP",
    nameEn: "BISP sport tee",
    ref: "BISP-TSHIRT-EPS",
    price: 22.0,
    image: tshirt,
    tag: "Sport · EPS",
    desc: "T-shirt blanc col rond pour l'EPS, coton souple, écusson brodé poitrine.",
  },
  {
    id: "trousse",
    name: "Trousse écussonnée",
    nameEn: "Embroidered pencil case",
    ref: "BISP-TROUSSE-01",
    price: 18.0,
    image: trousses,
    tag: "Accessoire",
    desc: "Trousse bleu marine #1F2E59 ou teal #348397 avec écusson brodé blanc + teal.",
  },
];

function CollegePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" cartCount={0} />

      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <Link to="/niveau" className="hover:text-primary">Boutique</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Collège · Middle school (6ᵉ → 4ᵉ)</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-soft)" }}>
        <div className="pointer-events-none absolute inset-0 text-primary">
          <ShellMotif className="absolute -left-32 -bottom-32 h-[480px] w-[480px]" opacity={0.04} />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
              <ShieldCheck className="h-3 w-3" /> Sélection officielle BISP
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Uniformes collège — 6ᵉ à 4ᵉ
            </h1>
            <p className="mt-1 text-sm italic text-muted-foreground">
              Middle school uniforms — Years 7 to 9
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Sélection complète d'uniformes brodés à l'écusson BISP. Tous les produits
              ci-dessous sont autorisés et recommandés pour les collégiens du Bilingual
              International School of Paris.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">{products.length} produits</span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">Tailles 10 ans → L</span>
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">Livraison à l'école</span>
            </div>
          </div>
          <div className="relative h-64 overflow-hidden rounded-3xl border border-border lg:h-80">
            <img src={collegeBisp} alt="Collégiens BISP" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const [size, setSize] = useState("14 ans");
  const [qty, setQty] = useState(1);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
          {product.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{product.name}</h3>
          <span className="text-lg font-semibold text-foreground">{product.price.toFixed(2)} €</span>
        </div>
        <p className="mt-0.5 text-xs italic text-muted-foreground">{product.nameEn}</p>
        <p className="mt-1 text-xs text-muted-foreground">Réf. {product.ref}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">{product.desc}</p>

        <div className="mt-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Taille · Size</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-9 px-2 min-w-[3.5rem] rounded-md border text-xs font-medium transition-all ${
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

        <div className="mt-5 flex items-stretch gap-2">
          <div className="inline-flex h-11 items-center rounded-lg border border-border bg-background">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 text-muted-foreground hover:text-foreground">−</button>
            <span className="w-7 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 text-muted-foreground hover:text-foreground">+</button>
          </div>
          <button className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Ajouter · Add
          </button>
        </div>
      </div>
    </article>
  );
}
