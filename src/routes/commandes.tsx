import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, Download } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { downloadOrderPdf } from "@/lib/orderPdf";

export const Route = createFileRoute("/commandes")({
  head: () => ({ meta: [{ title: "Mes commandes · My orders — BISP" }] }),
  component: () => (
    <RequireAuth>
      <CommandesPage />
    </RequireAuth>
  ),
});

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_mode?: string | null;
  shipping_label?: string | null;
  shipping_recipient?: string | null;
  shipping_address?: string | null;
  shipping_postal?: string | null;
  shipping_city?: string | null;
  family_civilite?: string | null;
  family_prenom?: string;
  family_nom?: string;
  family_email?: string;
  family_telephone?: string | null;
};

type Item = {
  id: string;
  order_id: string;
  child_prenom: string;
  child_nom: string;
  child_classe: string | null;
  product_name: string;
  product_ref: string;
  variant: string | null;
  size: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

function CommandesPage() {
  const { user, profile } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const toggle = async (orderId: string) => {
    if (open === orderId) { setOpen(null); return; }
    setOpen(orderId);
    if (!items[orderId]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", orderId);
      setItems((p) => ({ ...p, [orderId]: (data as Item[]) ?? [] }));
    }
  };

  const handleDownload = async (o: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    let list = items[o.id];
    if (!list) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
      list = (data as Item[]) ?? [];
      setItems((p) => ({ ...p, [o.id]: list! }));
    }
    downloadOrderPdf({
      order: {
        order_number: o.order_number,
        status: o.status,
        total_amount: Number(o.total_amount),
        created_at: o.created_at,
        shipping_mode: o.shipping_mode,
        shipping_label: o.shipping_label,
        shipping_recipient: o.shipping_recipient,
        shipping_address: o.shipping_address,
        shipping_postal: o.shipping_postal,
        shipping_city: o.shipping_city,
        family_civilite: o.family_civilite ?? profile?.civilite ?? null,
        family_prenom: o.family_prenom ?? profile?.prenom ?? "",
        family_nom: o.family_nom ?? profile?.nom ?? "",
        family_email: o.family_email ?? profile?.email ?? "",
        family_telephone: o.family_telephone ?? profile?.telephone ?? null,
      },
      items: list!,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
          <span className="h-px w-6 bg-[var(--rouge)]" /> Famille {profile?.nom ?? ""}
        </span>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Mes commandes</h1>
        <p className="mt-1 text-sm italic text-muted-foreground">My orders</p>

        <div className="mt-8 space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!loading && orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <Package className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Aucune commande pour le moment.</p>
              <Link to="/boutique" className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Aller à la boutique
              </Link>
            </div>
          )}
          {orders.map((o) => {
            const isOpen = open === o.id;
            const list = items[o.id] ?? [];
            return (
              <article key={o.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <button onClick={() => toggle(o.id)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/40">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · {o.status}
                    </div>
                    {o.shipping_label && (
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{o.shipping_label}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-foreground">{Number(o.total_amount).toFixed(2)} €</span>
                    <button
                      onClick={(e) => handleDownload(o, e)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                      title="Télécharger le bon de commande PDF"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-secondary/40 px-6 py-4">
                    {list.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Chargement des articles…</p>
                    ) : (
                      <ul className="divide-y divide-border">
                        {list.map((it) => (
                          <li key={it.id} className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <div className="font-medium text-foreground">{it.product_name} <span className="text-xs text-muted-foreground">· Réf {it.product_ref}</span></div>
                              <div className="text-xs text-muted-foreground">
                                {it.child_prenom} {it.child_nom}{it.child_classe ? ` · ${it.child_classe}` : ""} · Taille {it.size}{it.variant ? ` · ${it.variant}` : ""} · ×{it.quantity}
                              </div>
                            </div>
                            <div className="font-semibold text-foreground">{Number(it.line_total).toFixed(2)} €</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}