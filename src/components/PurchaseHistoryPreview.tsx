import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, RefreshCw } from "lucide-react";
import {
  fetchChildPurchaseHistory,
  groupLatestByProduct,
  type PurchaseHistoryItem,
} from "@/lib/purchaseHistory";

export function PurchaseHistoryPreview({ childId, limit = 3 }: { childId: string; limit?: number }) {
  const [items, setItems] = useState<PurchaseHistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchChildPurchaseHistory(childId)
      .then((res) => {
        if (!cancelled) setItems(groupLatestByProduct(res).slice(0, limit));
      })
      .catch((e) => !cancelled && setError(e.message ?? "Erreur"));
    return () => {
      cancelled = true;
    };
  }, [childId, limit]);

  if (error) return null;
  if (items === null) {
    return <p className="text-xs italic text-muted-foreground">Chargement de l'historique…</p>;
  }
  if (items.length === 0) {
    return <p className="text-xs italic text-muted-foreground">Aucun achat précédent pour cet enfant.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-xs"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">{it.product_name}</div>
              <div className="text-muted-foreground">Taille {it.size} · {new Date(it.ordered_at).toLocaleDateString("fr-FR")}</div>
            </div>
          </div>
          {it.needsReplacement && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
              <RefreshCw className="h-3 w-3" /> À remplacer
            </span>
          )}
        </div>
      ))}
      <Link
        to="/enfants/$childId/historique"
        params={{ childId }}
        className="inline-block text-xs text-[var(--teal-deep)] hover:underline"
      >
        Voir tout l'historique →
      </Link>
    </div>
  );
}