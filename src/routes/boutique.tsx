import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import poloFront from "@/assets/polo-bisp-blanc.svg";
import poloBack from "@/assets/polo-bisp-marine.svg";
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
  images: string[];
  sizes: string[];
  badge?: string;
  category: "Polos" | "Pulls" | "Chemises" | "T-shirts" | "Accessoires";
};

const children = [
  { id: "emma", name: "Emma Dubois", classe: "CE2", initials: "ED", color: "bg-[var(--teal)]/15 text-[var(--teal-deep)]" },
  { id: "thomas", name: "Thomas Dubois", classe: "6ᵉ B", initials: "TD", color: "bg-primary/15 text-primary" },
];

const kidsSizes = ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"];
const adultSizes = ["XS", "S", "M", "L", "XL"];

const products: Product[] = [
  { id: "polo-officiel", name: "Polo officiel BISP", nameEn: "Official BISP polo", price: "28,00 €", images: [poloFront, poloBack], sizes: kidsSizes, badge: "Best-seller", category: "Polos" },
  { id: "pull-marine", name: "Pull marine brodé", nameEn: "Embroidered navy jumper", price: "52,00 €", images: [pull], sizes: kidsSizes, badge: "Hiver", category: "Pulls" },
  { id: "chemise-garcon", name: "Chemise officielle", nameEn: "Official shirt", price: "34,00 €", images: [chemise], sizes: kidsSizes, category: "Chemises" },
  { id: "chemise-fille", name: "Chemisier officiel", nameEn: "Official blouse", price: "34,00 €", images: [chemiseFille], sizes: kidsSizes, category: "Chemises" },
  { id: "tshirt-sport", name: "T-shirt sport", nameEn: "Sports t-shirt", price: "22,00 €", images: [tshirt], sizes: kidsSizes, category: "T-shirts" },
  { id: "trousses", name: "Trousses brodées", nameEn: "Embroidered pencil case", price: "18,00 €", images: [trousses], sizes: ["Unique"], badge: "Nouveau", category: "Accessoires" },
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
  const [view, setView] = useState(0);
  const [child, setChild] = useState(children[0].id);
  const [size, setSize] = useState<string>("");
  const hasMultipleViews = product.images.length > 1;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[view]}
          alt={product.name}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
            product.images[view].endsWith(".svg") ? "object-contain p-8" : "object-cover"
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
        {hasMultipleViews && (
          <div className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-white/95 p-1 shadow-sm backdrop-blur">
            {["Avant · Front", "Arrière · Back"].map((label, i) => (
              <button
                key={label}
                onClick={() => setView(i)}
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  view === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--teal-deep)]">
          {product.category}
        </div>
        <h3 className="mt-1 text-base font-semibold text-foreground">{product.name}</h3>
        <p className="text-xs italic text-muted-foreground">{product.nameEn}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">{product.price}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-[var(--teal-deep)]" /> Brodé
          </span>
        </div>

        {/* Pour quel enfant */}
        <div className="mt-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pour · For
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setChild(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  child === c.id ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${c.color}`}>
                  {c.initials}
                </span>
                <span className="font-medium">{c.name.split(" ")[0]}</span>
                <span className="text-[10px] text-muted-foreground">{c.classe}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Taille */}
        <div className="mt-3">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Taille · Size
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-[2.5rem] rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
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

        <Link
          to="/panier"
          aria-disabled={!size}
          className={`mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
            size
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "pointer-events-none bg-muted text-muted-foreground"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {size ? `Ajouter · Add — ${size}` : "Choisir une taille · Pick a size"}
        </Link>
      </div>
    </article>
  );
}
