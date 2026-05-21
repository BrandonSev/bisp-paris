import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, UserPlus } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { AddChildDialog } from "@/components/AddChildDialog";
import { TrousseImage } from "@/components/TrousseImage";
import { recommendSize } from "@/lib/sizeRecommendation";
import { SizeBadge } from "@/components/SizeBadge";
import poloFront from "@/assets/polo-bisp-marine.svg";
import poloBack from "@/assets/polo-bisp-blanc.svg";
import hoodieFront from "@/assets/hoodie-bisp-back.svg";
import hoodieBack from "@/assets/hoodie-bisp-front.svg";
import teddyFront from "@/assets/teddy-bisp-front.svg";
import teddyBack from "@/assets/teddy-bisp-back.svg";
import trousse from "@/assets/trousse-bisp.svg";

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
  component: () => (
    <RequireAuth>
      <BoutiquePage />
    </RequireAuth>
  ),
});

type Product = {
  id: string;
  name: string;
  nameEn: string;
  /** prix par taille — la plage est calculée min/max */
  pricing: Record<string, number>;
  images: string[];
  sizes: string[];
  /** options de personnalisation (ex: couleur du zip) */
  options?: ProductOption[];
  category: "Polos" | "Pulls" | "Sweats" | "Chemises" | "T-shirts" | "Accessoires";
  /** Type de produit pour ajuster la recommandation de taille (ex: hoodie/teddy → +1). */
  productKind?: "outer";
};

type ProductOption = {
  id: string;
  label: string;
  choices: { value: string; label: string; swatch: string }[];
};

const kidsSizes = ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"];

/**
 * 3 groupes de tailles avec un prix unique par groupe.
 * Les prix sont indicatifs et facilement modifiables produit par produit.
 */
const SIZE_GROUPS = {
  enfant: ["3 ans", "4 ans", "6 ans", "8 ans", "10 ans"],
  junior: ["12 ans", "14 ans", "16 ans", "18 ans"],
  adulte: ["XS", "S", "M", "L", "XL"],
} as const;

const ALL_APPAREL_SIZES = [
  ...SIZE_GROUPS.enfant,
  ...SIZE_GROUPS.junior,
  ...SIZE_GROUPS.adulte,
];

/** Construit un mapping taille → prix à partir d'un prix par groupe. */
function groupPricing(prices: { enfant: number; junior: number; adulte: number }): Record<string, number> {
  const out: Record<string, number> = {};
  SIZE_GROUPS.enfant.forEach((s) => (out[s] = prices.enfant));
  SIZE_GROUPS.junior.forEach((s) => (out[s] = prices.junior));
  SIZE_GROUPS.adulte.forEach((s) => (out[s] = prices.adulte));
  return out;
}

function sizeGroupLabel(size: string): "Enfant" | "Junior" | "Adulte" | null {
  if ((SIZE_GROUPS.enfant as readonly string[]).includes(size)) return "Enfant";
  if ((SIZE_GROUPS.junior as readonly string[]).includes(size)) return "Junior";
  if ((SIZE_GROUPS.adulte as readonly string[]).includes(size)) return "Adulte";
  return null;
}

const trousseColors: ProductOption = {
  id: "zip",
  label: "Couleur du zip",
  choices: [
    { value: "teal", label: "Teal", swatch: "var(--teal)" },
    { value: "blanc", label: "Blanc", swatch: "#ffffff" },
  ],
};

const products: Product[] = [
  {
    id: "polo-officiel",
    name: "Polo officiel BISP",
    nameEn: "Official BISP polo",
    pricing: groupPricing({ enfant: 28, junior: 32, adulte: 36 }),
    images: [poloFront, poloBack],
    sizes: ALL_APPAREL_SIZES,
    category: "Polos",
  },
  {
    id: "hoodie-jean-eudes",
    name: "Hoodie zippé Jean-Eudes",
    nameEn: "Jean-Eudes zip hoodie",
    pricing: groupPricing({ enfant: 62, junior: 72, adulte: 82 }),
    images: [hoodieFront, hoodieBack],
    sizes: ALL_APPAREL_SIZES,
    category: "Sweats",
    productKind: "outer",
  },
  {
    id: "teddy-charlie",
    name: "Teddy boutonné Charlie",
    nameEn: "Charlie button teddy jacket",
    pricing: groupPricing({ enfant: 78, junior: 90, adulte: 102 }),
    images: [teddyFront, teddyBack],
    sizes: ALL_APPAREL_SIZES,
    category: "Pulls",
    productKind: "outer",
  },
  {
    id: "trousse",
    name: "Trousse brodée",
    nameEn: "Embroidered pencil case",
    pricing: { Unique: 18 },
    images: [trousse],
    sizes: ["Unique"],
    options: [trousseColors],
    category: "Accessoires",
  },
];

const categories = ["Tous", "Polos", "Sweats", "Pulls", "Accessoires"] as const;

function BoutiquePage() {
  const [active, setActive] = useState<(typeof categories)[number]>("Tous");
  const filtered = active === "Tous" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />

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
  const { children: kids, addToCart } = useStore();
  const [view, setView] = useState(0);
  const [child, setChild] = useState<string>(kids[0]?.id ?? "");
  const [showAddChild, setShowAddChild] = useState(false);
  const [size, setSize] = useState<string>("");
  const [opts, setOpts] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((o) => [o.id, o.choices[0].value])),
  );
  const [qty, setQty] = useState(1);
  const hasMultipleViews = product.images.length > 1;

  const prices = Object.values(product.pricing);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    minPrice === maxPrice
      ? `${minPrice.toFixed(2)} €`
      : `${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)} €`;
  const currentPrice = size ? product.pricing[size] : undefined;

  const canAdd = !!size && !!child;

  const selectedChild = kids.find((k) => k.id === child);
  const recommendation = useMemo(() => {
    if (!selectedChild) return null;
    const reco = recommendSize(
      {
        hauteur: selectedChild.hauteur,
        tour: selectedChild.tour,
        tour_taille: selectedChild.tour_taille,
        tour_bassin: selectedChild.tour_bassin,
      },
      product.productKind === "outer" ? { product: "outer" } : {},
    );
    if (!reco) return null;
    const match = product.sizes.find(
      (s) => s.trim().toLowerCase() === reco.row.age.trim().toLowerCase(),
    );
    return match ? { size: match, consistent: reco.consistent } : null;
  }, [selectedChild, product.sizes, product.productKind]);

  // Pré-sélectionne la taille recommandée quand l'enfant change.
  useEffect(() => {
    if (recommendation) setSize(recommendation.size);
  }, [recommendation]);

  const handleAdd = () => {
    if (!canAdd || currentPrice === undefined) return;
    const selected = kids.find((k) => k.id === child);
    const optionLabels = (product.options ?? [])
      .map((o) => {
        const choice = o.choices.find((c) => c.value === opts[o.id]);
        return choice ? `${o.label}: ${choice.label}` : null;
      })
      .filter(Boolean) as string[];
    const nameWithOpts = optionLabels.length
      ? `${product.name} (${optionLabels.join(", ")})`
      : product.name;
    const variantKey = optionLabels.join(", ");
    addToCart({
      productId: variantKey ? `${product.id}::${variantKey}` : product.id,
      name: nameWithOpts,
      ref: `BISP-${product.id.toUpperCase()}`,
      price: currentPrice,
      size,
      qty,
      image: product.images[0],
      childId: child,
    });
    toast.success(`Ajouté · ${product.name}`, {
      description: `${qty} × Taille ${size} · ${(currentPrice * qty).toFixed(2)} €${selected ? ` · pour ${selected.prenom}` : ""}`,
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.id === "trousse" ? (
          <TrousseImage
            zipColor={
              product.options?.[0]?.choices.find((c) => c.value === opts["zip"])?.swatch ??
              "var(--primary)"
            }
            className="h-full w-full p-8 transition-transform duration-500 group-hover:scale-105 [&>svg]:h-full [&>svg]:w-full"
          />
        ) : (
          <img
            src={product.images[view]}
            alt={product.name}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
              product.images[view].endsWith(".svg") ? "object-contain p-8" : "object-cover"
            }`}
            loading="lazy"
          />
        )}
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
          <span className="text-lg font-semibold text-foreground">
            {currentPrice !== undefined ? `${currentPrice.toFixed(2)} €` : priceLabel}
            {currentPrice === undefined && minPrice !== maxPrice && (
              <span className="ml-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                selon taille
              </span>
            )}
          </span>
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
            {kids.map((c) => (
              <button
                key={c.id}
                onClick={() => setChild(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  child === c.id ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold bg-primary/15 text-primary">
                  {c.initials}
                </span>
                <span className="font-medium">{c.prenom}</span>
                <span className="text-[10px] text-muted-foreground">{c.classe}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowAddChild(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {kids.length === 0 ? "Ajouter un enfant · Add a child" : "Ajouter · Add"}
            </button>
          </div>
        </div>

        {/* Taille */}
        <div className="mt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Taille · Size
            </label>
            {recommendation && (
              <SizeBadge
                size={recommendation.size}
                variant={product.productKind === "outer" ? "outer" : "default"}
              />
            )}
          </div>
          {recommendation && (
            <p className="mt-1 text-[10px] italic leading-snug text-muted-foreground">
              {product.productKind === "outer"
                ? "Recommandation ajustée pour une couche supérieure (pull, hoodie, teddy)."
                : "Recommandation pour une 1ʳᵉ couche (t-shirt, polo, chemise)."}
            </p>
          )}
          {(() => {
            const groups: { label: string; sizes: string[] }[] = [
              { label: "Enfant", sizes: product.sizes.filter((s) => (SIZE_GROUPS.enfant as readonly string[]).includes(s)) },
              { label: "Junior", sizes: product.sizes.filter((s) => (SIZE_GROUPS.junior as readonly string[]).includes(s)) },
              { label: "Adulte", sizes: product.sizes.filter((s) => (SIZE_GROUPS.adulte as readonly string[]).includes(s)) },
            ].filter((g) => g.sizes.length > 0);
            const ungrouped = product.sizes.filter((s) => !sizeGroupLabel(s));
            return (
              <div className="mt-1.5 space-y-2">
                {groups.map((g) => {
                  const groupPrice = product.pricing[g.sizes[0]];
                  return (
                    <div key={g.label}>
                      <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                        <span>{g.label}</span>
                        {groupPrice !== undefined && (
                          <span className="tabular-nums">{groupPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {g.sizes.map((s) => (
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
                  );
                })}
                {ungrouped.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {ungrouped.map((s) => (
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
                )}
              </div>
            );
          })()}
        </div>

        {/* Options (couleur, etc.) */}
        {product.options?.map((opt) => (
          <div key={opt.id} className="mt-3">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {opt.label}
            </label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {opt.choices.map((c) => {
                const selected = opts[opt.id] === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setOpts((p) => ({ ...p, [opt.id]: c.value }))}
                    title={c.label}
                    aria-label={c.label}
                    aria-pressed={selected}
                    className={`relative h-7 w-7 rounded-full border transition-all ${
                      selected
                        ? "border-primary ring-2 ring-primary/30 ring-offset-1 ring-offset-card"
                        : "border-border hover:border-primary/40"
                    }`}
                    style={{ background: c.swatch }}
                  />
                );
              })}
              <span className="ml-1 text-[11px] text-muted-foreground">
                {opt.choices.find((c) => c.value === opts[opt.id])?.label}
              </span>
            </div>
          </div>
        ))}

        {/* Quantité + Ajouter */}
        <div className="mt-4 flex items-stretch gap-2">
          <div className="inline-flex items-center rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Diminuer la quantité"
              className="flex h-11 w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              disabled={qty >= 99}
              aria-label="Augmenter la quantité"
              className="flex h-11 w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
              canAdd
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {canAdd && currentPrice !== undefined
              ? `Ajouter · ${(currentPrice * qty).toFixed(2)} €`
              : "Choisir une taille · Pick a size"}
          </button>
        </div>
      </div>
      <AddChildDialog
        open={showAddChild}
        onClose={() => setShowAddChild(false)}
        onCreated={(c) => {
          setChild(c.id);
          setShowAddChild(false);
        }}
      />
    </article>
  );
}
