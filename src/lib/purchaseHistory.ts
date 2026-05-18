import { supabase } from "@/integrations/supabase/client";

/**
 * Replacement thresholds (in months) per product category.
 * Used to suggest when an item should likely be re-purchased.
 */
export const replacementMonths: Record<string, number> = {
  Polos: 6,
  "T-shirts": 6,
  Chemises: 8,
  Pulls: 12,
  Accessoires: 24,
};

/** Heuristic category resolver based on product name / ref. */
export function categoryFor(name: string, ref?: string | null): string {
  const s = `${name} ${ref ?? ""}`.toLowerCase();
  if (s.includes("polo")) return "Polos";
  if (s.includes("t-shirt") || s.includes("tshirt")) return "T-shirts";
  if (s.includes("chemise")) return "Chemises";
  if (s.includes("hoodie") || s.includes("pull") || s.includes("teddy") || s.includes("sweat") || s.includes("blouse"))
    return "Pulls";
  return "Accessoires";
}

export type PurchaseHistoryItem = {
  id: string;
  order_id: string;
  order_number: string;
  order_status: string;
  ordered_at: string;
  product_id: string;
  product_name: string;
  product_ref: string;
  size: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  variant: string | null;
  category: string;
  needsReplacement: boolean;
  monthsSince: number;
};

function monthsBetween(d: Date, now = new Date()): number {
  const ms = now.getTime() - d.getTime();
  return ms / (1000 * 60 * 60 * 24 * 30.4375);
}

/** Fetch purchase history for a given child (RLS-scoped to current user). */
export async function fetchChildPurchaseHistory(childId: string): Promise<PurchaseHistoryItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select(
      "id, order_id, product_id, product_name, product_ref, size, quantity, unit_price, line_total, variant, orders!inner(order_number, status, created_at)",
    )
    .eq("child_id", childId)
    .order("created_at", { foreignTable: "orders", ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as any[];
  const now = new Date();
  return rows.map((r) => {
    const orderedAt = r.orders?.created_at ?? new Date().toISOString();
    const months = monthsBetween(new Date(orderedAt), now);
    const category = categoryFor(r.product_name, r.product_ref);
    const threshold = replacementMonths[category] ?? 12;
    return {
      id: r.id,
      order_id: r.order_id,
      order_number: r.orders?.order_number ?? "",
      order_status: r.orders?.status ?? "",
      ordered_at: orderedAt,
      product_id: r.product_id,
      product_name: r.product_name,
      product_ref: r.product_ref,
      size: r.size,
      quantity: r.quantity,
      unit_price: Number(r.unit_price),
      line_total: Number(r.line_total),
      variant: r.variant ?? null,
      category,
      needsReplacement: months >= threshold,
      monthsSince: months,
    } as PurchaseHistoryItem;
  });
}

/** Group history items by product_id, keeping the latest record per product. */
export function groupLatestByProduct(items: PurchaseHistoryItem[]): PurchaseHistoryItem[] {
  const map = new Map<string, PurchaseHistoryItem>();
  for (const it of items) {
    const existing = map.get(it.product_id);
    if (!existing || new Date(it.ordered_at) > new Date(existing.ordered_at)) {
      map.set(it.product_id, it);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.ordered_at).getTime() - new Date(a.ordered_at).getTime(),
  );
}