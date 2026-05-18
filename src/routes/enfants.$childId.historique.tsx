import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import { RequireAuth } from "@/components/RequireAuth";
import { useStore } from "@/lib/store";
import {
  fetchChildPurchaseHistory,
  replacementMonths,
  type PurchaseHistoryItem,
} from "@/lib/purchaseHistory";
import { toast } from "sonner";

export const Route = createFileRoute("/enfants/$childId/historique")({
  head: () => ({ meta: [{ title: "Historique enfant · Child history — BISP" }] }),
  component: () => (
    <RequireAuth>
      <HistoriquePage />
    </RequireAuth>
  ),
});

function HistoriquePage() {
  const { childId } = Route.useParams();
  const { children: kids } = useStore();
  const child = kids.find((k) => k.id === childId);
  const [items, setItems] = useState<PurchaseHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchChildPurchaseHistory(childId)
      .then(setItems)
      .catch((e) => toast.error(e.message ?? "Erreur"))
      .finally(() => setLoading(false));
  }, [childId]);

  const grouped = useMemo(() => {
    if (!items) return [] as { category: string; items: PurchaseHistoryItem[] }[];
    const map = new Map<string, PurchaseHistoryItem[]>();
    for (const it of items) {
      const list = map.get(it.category) ?? [];
      list.push(it);
      map.set(it.category, list);
    }
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }, [items]);

  const toReplace = items?.filter((i) => i.needsReplacement) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />

      <section className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-10 right-0 -z-0 h-72 w-72 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.04} />
        </div>

        <Link to="/enfants" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour · Back
        </Link>

        <div className="relative mt-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
            <span className="h-px w-6 bg-[var(--rouge)]" /> Historique d'achat
          </span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {child ? `${child.prenom} ${child.nom}` : "Enfant"}
          </h1>
          <p className="mt-1 text-sm italic text-muted-foreground">Purchase history</p>
          {child && (
            <p className="mt-2 text-sm text-muted-foreground">
              {child.section} · {child.classe}
            </p>
          )}
        </div>

        {toReplace.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-amber-900">
              <RefreshCw className="h-4 w-4" />
              <h2 className="text-sm font-semibold">À remplacer prochainement</h2>
            </div>
            <p className="mt-1 text-xs text-amber-800">
              Selon les seuils par catégorie : Polos ({replacementMonths.Polos} mois), Pulls (
              {replacementMonths.Pulls} mois), Chemises ({replacementMonths.Chemises} mois)…
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground">
              {toReplace.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-2">
                  <span>
                    {it.product_name} <span className="text-muted-foreground">· taille {it.size}</span>
                  </span>
                  <Link
                    to="/boutique"
                    className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <ShoppingBag className="mr-1 h-3 w-3" /> Racheter
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-sm italic text-muted-foreground">Chargement…</p>
        ) : !items || items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Aucun achat enregistré pour cet enfant.</p>
            <Link
              to="/boutique"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Aller à la boutique
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {grouped.map(({ category, items }) => (
              <section key={category} className="overflow-hidden rounded-2xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border bg-secondary/60 px-5 py-3">
                  <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                  <span className="text-[11px] text-muted-foreground">
                    Remplacement conseillé : {replacementMonths[category] ?? 12} mois
                  </span>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">{it.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          Taille {it.size} · {it.quantity} × {it.unit_price.toFixed(2)} € ·{" "}
                          {new Date(it.ordered_at).toLocaleDateString("fr-FR")} · Cmd {it.order_number}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {it.needsReplacement && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                            À remplacer
                          </span>
                        )}
                        <span className="text-sm font-semibold text-foreground">{it.line_total.toFixed(2)} €</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}