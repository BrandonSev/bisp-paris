import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import poloBlanc from "@/assets/polo-bisp-blanc.svg";
import poloMarine from "@/assets/polo-bisp-marine.svg";
import pull from "@/assets/pull-bisp.jpg";
import chemise from "@/assets/chemise-bisp.jpg";
import chemiseFille from "@/assets/chemise-bisp-fille.png";
import tshirt from "@/assets/tshirt-bisp.jpg";
import trousses from "@/assets/trousses-bisp.png";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique officielle des uniformes — BISP" },
      {
        name: "description",
        content:
          "Découvrez tous les uniformes officiels du Bilingual International School of Paris : polos, pulls, chemises, t-shirts et trousses brodés à l'écusson BISP.",
      },
      { property: "og:title", content: "Boutique officielle BISP" },
      {
        property: "og:description",
        content: "Tous les uniformes officiels brodés de l'écusson BISP.",
      },
    ],
  }),
  component: BoutiquePage,
});

type Product = {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  image: string;
  badge?: string;
  category: "Polos" | "Pulls" | "Chemises" | "T-shirts" | "Accessoires";
};

const products: Product[] = [
  { id: "polo-blanc", name: "Polo officiel blanc", nameEn: "Official white polo", price: "28,00 €", image: poloBlanc, badge: "Best-seller", category: "Polos" },
  { id: "polo-marine", name: "Polo officiel marine", nameEn: "Official navy polo", price: "28,00 €", image: poloMarine, category: "Polos" },
  { id: "pull-marine", name: "Pull marine brodé", nameEn: "Embroidered navy jumper", price: "52,00 €", image: pull, badge: "Hiver", category: "Pulls" },
  { id: "chemise-garcon", name: "Chemise officielle", nameEn: "Official shirt", price: "34,00 €", image: chemise, category: "Chemises" },
  { id: "chemise-fille", name: "Chemisier officiel", nameEn: "Official blouse", price: "34,00 €", image: chemiseFille, category: "Chemises" },
  { id: "tshirt-sport", name: "T-shirt sport", nameEn: "Sports t-shirt", price: "22,00 €", image: tshirt, category: "T-shirts" },
  { id: "trousses", name: "Trousses brodées", nameEn: "Embroidered pencil case", price: "18,00 €", image: trousses, badge: "Nouveau", category: "Accessoires" },
];

const categories = ["Tous", "Polos", "Pulls", "Chemises", "T-shirts", "Accessoires"] as const;

function BoutiquePage() {
  const [active, setActive] = useState<(typeof categories)[number]>("Tous");
  const filtered = active === "Tous" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" cartCount={0} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-soft)" }}>
        <div className="pointer-events-none absolute inset-0 text-primary">
          <ShellMotif className="absolute -left-32 -top-20 h-[500px] w-[500px]" opacity={0.04} />
          <ShellMotif className="absolute -right-40 -bottom-40 h-[600px] w-[600px]" opacity={0.03} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--teal)]/30 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--teal-deep)] shadow-sm">
            <Sparkles className="h-3 w-3" /> Rentrée 2026-2027 · Back to school
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Boutique officielle BISP
          </h1>
          <p className="mt-2 text-sm italic text-muted-foreground">Official BISP uniform shop</p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[var(--rouge)]" />
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Tous les uniformes brodés de l'écusson officiel, confectionnés pour le quotidien des élèves.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Besoin d'aide ? Need help ? — <span className="text-foreground font-medium">operations@bisparis.com</span>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
            product.image.endsWith(".svg") ? "object-contain p-8" : "object-cover"
          }`}
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--rouge)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {product.badge}
          </span>
        )}
        <button className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-muted-foreground shadow-sm transition-colors hover:text-[var(--rouge)]">
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
          {product.category}
        </div>
        <h3 className="mt-1 text-base font-semibold text-foreground">{product.name}</h3>
        <p className="text-xs italic text-muted-foreground">{product.nameEn}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">{product.price}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-[var(--teal-deep)]" /> Brodé
          </span>
        </div>
        <Link
          to="/panier"
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ShoppingBag className="h-4 w-4" /> Ajouter · Add
        </Link>
      </div>
    </article>
  );
}
