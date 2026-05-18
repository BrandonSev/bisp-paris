import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Download, ShieldCheck, AlertCircle, Users, Package, Trash2, CheckCircle2, Plus } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Espace administrateur — BISP" }] }),
  component: () => (
    <RequireAuth>
      <AdminPage />
    </RequireAuth>
  ),
});

type Row = {
  order_number: string;
  created_at: string;
  status: string;
  family_civilite: string | null;
  family_nom: string;
  family_prenom: string;
  family_email: string;
  family_telephone: string | null;
  child_prenom: string;
  child_nom: string;
  child_classe: string | null;
  child_section: string | null;
  product_name: string;
  product_ref: string;
  variant: string | null;
  size: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

const ORDER_STATUSES = [
  "En attente",
  "Payée",
  "En préparation",
  "Prête",
  "Expédiée",
  "Livrée",
  "Annulée",
] as const;

const INCIDENT_TYPES = [
  { value: "taille", label: "Problème de taille" },
  { value: "qualite", label: "Défaut qualité" },
  { value: "manquant", label: "Article manquant" },
  { value: "livraison", label: "Problème livraison" },
  { value: "autre", label: "Autre" },
];

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  family_nom: string;
  family_prenom: string;
  family_email: string;
  tracking_number: string | null;
  tracking_carrier: string | null;
};

type Incident = {
  id: string;
  order_id: string;
  type: string;
  description: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  order_number?: string;
  family_nom?: string;
};

type RoleUser = {
  user_id: string;
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
};

function AdminPage() {
  const { isAdmin, authLoading } = useStore();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          child_prenom, child_nom, child_classe, child_section,
          product_name, product_ref, variant, size, quantity, unit_price, line_total,
          orders!inner ( order_number, created_at, status, family_civilite, family_nom, family_prenom, family_email, family_telephone )
        `)
        .order("created_at", { foreignTable: "orders", ascending: false });
      if (error) { toast.error(error.message); setLoading(false); return; }
      const flat: Row[] = (data ?? []).map((r: any) => ({
        order_number: r.orders.order_number,
        created_at: r.orders.created_at,
        status: r.orders.status,
        family_civilite: r.orders.family_civilite,
        family_nom: r.orders.family_nom,
        family_prenom: r.orders.family_prenom,
        family_email: r.orders.family_email,
        family_telephone: r.orders.family_telephone,
        child_prenom: r.child_prenom,
        child_nom: r.child_nom,
        child_classe: r.child_classe,
        child_section: r.child_section,
        product_name: r.product_name,
        product_ref: r.product_ref,
        variant: r.variant,
        size: r.size,
        quantity: r.quantity,
        unit_price: Number(r.unit_price),
        line_total: Number(r.line_total),
      }));
      setRows(flat);
      setLoading(false);
    })();
  }, [isAdmin]);

  const exportExcel = () => {
    const data = rows.map((r) => ({
      "N° Commande": r.order_number,
      "Date": new Date(r.created_at).toLocaleDateString("fr-FR"),
      "Statut": r.status,
      "Famille": `${r.family_civilite ?? ""} ${r.family_prenom} ${r.family_nom}`.trim(),
      "Email": r.family_email,
      "Téléphone": r.family_telephone ?? "",
      "Enfant": `${r.child_prenom} ${r.child_nom}`,
      "Classe": r.child_classe ?? "",
      "Section": r.child_section ?? "",
      "Produit": r.product_name,
      "Référence": r.product_ref,
      "Variante": r.variant ?? "",
      "Taille": r.size,
      "Quantité": r.quantity,
      "Prix unitaire (€)": r.unit_price,
      "Total ligne (€)": r.line_total,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commandes BISP");
    const fname = `commandes-bisp-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fname);
    toast.success(`Export généré : ${fname}`);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background"><SiteHeader schoolName="BISP" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader schoolName="BISP" />
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Accès réservé</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cette page est réservée aux administrateurs BISP.</p>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const totalCommandes = new Set(rows.map((r) => r.order_number)).size;
  const totalArticles = rows.reduce((s, r) => s + r.quantity, 0);
  const totalCA = rows.reduce((s, r) => s + r.line_total, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
              <span className="h-px w-6 bg-[var(--rouge)]" /> Espace administrateur
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Commandes fournisseur</h1>
            <p className="mt-1 text-sm text-muted-foreground">Vue consolidée de toutes les commandes familles.</p>
          </div>
          <button
            onClick={exportExcel}
            disabled={rows.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Exporter Excel fournisseur
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Commandes" value={totalCommandes.toString()} />
          <Stat label="Articles" value={totalArticles.toString()} />
          <Stat label="Total" value={`${totalCA.toFixed(2)} €`} />
        </div>

        <Tabs defaultValue="commandes" className="mt-8">
          <TabsList>
            <TabsTrigger value="commandes"><Package className="mr-2 h-4 w-4" />Commandes</TabsTrigger>
            <TabsTrigger value="statuts"><CheckCircle2 className="mr-2 h-4 w-4" />Statuts</TabsTrigger>
            <TabsTrigger value="incidents"><AlertCircle className="mr-2 h-4 w-4" />Incidents</TabsTrigger>
            <TabsTrigger value="roles"><Users className="mr-2 h-4 w-4" />Rôles APEL</TabsTrigger>
          </TabsList>

          <TabsContent value="commandes" className="mt-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Commande</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Famille</th>
                  <th className="px-4 py-3">Enfant</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Variante</th>
                  <th className="px-4 py-3">Taille</th>
                  <th className="px-4 py-3 text-right">Qté</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && (
                  <tr><td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">Chargement…</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-6 text-center text-muted-foreground">Aucune commande pour le moment.</td></tr>
                )}
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.order_number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">{r.family_prenom} {r.family_nom}</td>
                    <td className="px-4 py-3">{r.child_prenom} {r.child_nom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.child_classe ?? "—"}</td>
                    <td className="px-4 py-3">{r.product_name} <span className="text-xs text-muted-foreground">({r.product_ref})</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.variant ?? "—"}</td>
                    <td className="px-4 py-3">{r.size}</td>
                    <td className="px-4 py-3 text-right">{r.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold">{r.line_total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="statuts" className="mt-4">
            <StatusManager />
          </TabsContent>

          <TabsContent value="incidents" className="mt-4">
            <IncidentsManager />
          </TabsContent>

          <TabsContent value="roles" className="mt-4">
            <RolesManager />
          </TabsContent>
        </Tabs>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

// ============================================================
// Onglet : Gestion des statuts de commande
// ============================================================
function StatusManager() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, created_at, status, total_amount, family_nom, family_prenom, family_email, tracking_number, tracking_carrier")
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setOrders((data as any[]).map((o) => ({ ...o, total_amount: Number(o.total_amount) })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    toast.success("Statut mis à jour");
  };

  const updateTracking = async (id: string, tracking_number: string, tracking_carrier: string) => {
    const { error } = await supabase.from("orders").update({ tracking_number, tracking_carrier }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, tracking_number, tracking_carrier } : o));
    toast.success("Suivi enregistré");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (orders.length === 0) return <p className="text-sm text-muted-foreground">Aucune commande.</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Famille</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Suivi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{o.order_number}</td>
                <td className="px-4 py-3">{o.family_prenom} {o.family_nom}<div className="text-xs text-muted-foreground">{o.family_email}</div></td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3 text-right font-semibold">{o.total_amount.toFixed(2)} €</td>
                <td className="px-4 py-3">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                    <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <TrackingForm
                    initialNumber={o.tracking_number ?? ""}
                    initialCarrier={o.tracking_carrier ?? ""}
                    onSave={(n, c) => updateTracking(o.id, n, c)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrackingForm({ initialNumber, initialCarrier, onSave }: { initialNumber: string; initialCarrier: string; onSave: (n: string, c: string) => void }) {
  const [n, setN] = useState(initialNumber);
  const [c, setC] = useState(initialCarrier);
  return (
    <div className="flex items-center gap-2">
      <Input value={c} onChange={(e) => setC(e.target.value)} placeholder="Transporteur" className="h-9 w-28" />
      <Input value={n} onChange={(e) => setN(e.target.value)} placeholder="N° suivi" className="h-9 w-36" />
      <Button size="sm" variant="outline" onClick={() => onSave(n.trim(), c.trim())}>OK</Button>
    </div>
  );
}

// ============================================================
// Onglet : Gestion des incidents
// ============================================================
function IncidentsManager() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [orders, setOrders] = useState<{ id: string; order_number: string; family_nom: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("open");

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: incData, error: incErr }, { data: ordData }] = await Promise.all([
      supabase
        .from("order_incidents")
        .select("*, orders!inner(order_number, family_nom)")
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("id, order_number, family_nom").order("created_at", { ascending: false }),
    ]);
    if (incErr) { toast.error(incErr.message); setLoading(false); return; }
    setIncidents((incData as any[]).map((i) => ({
      ...i,
      order_number: i.orders?.order_number,
      family_nom: i.orders?.family_nom,
    })));
    setOrders((ordData ?? []) as any);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resolve = async (id: string, note: string) => {
    const { error } = await supabase
      .from("order_incidents")
      .update({ status: "resolved", resolved_at: new Date().toISOString(), resolution_note: note || null })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Incident résolu");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("order_incidents").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Incident supprimé");
    load();
  };

  const filtered = incidents.filter((i) => filter === "all" ? true : i.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["open", "resolved", "all"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
              {f === "open" ? "Ouverts" : f === "resolved" ? "Résolus" : "Tous"}
            </Button>
          ))}
        </div>
        <NewIncidentDialog orders={orders} onCreated={load} />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {!loading && filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucun incident.</p>}

      <div className="space-y-3">
        {filtered.map((inc) => (
          <div key={inc.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={inc.status === "open" ? "destructive" : "secondary"}>
                    {inc.status === "open" ? "Ouvert" : "Résolu"}
                  </Badge>
                  <Badge variant="outline">{INCIDENT_TYPES.find((t) => t.value === inc.type)?.label ?? inc.type}</Badge>
                  <span className="text-sm font-medium">{inc.order_number}</span>
                  <span className="text-xs text-muted-foreground">{inc.family_nom}</span>
                  <span className="text-xs text-muted-foreground">· {new Date(inc.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                <p className="mt-2 text-sm">{inc.description}</p>
                {inc.resolution_note && (
                  <p className="mt-2 text-xs text-muted-foreground"><strong>Résolution :</strong> {inc.resolution_note}</p>
                )}
              </div>
              <div className="flex gap-2">
                {inc.status === "open" && <ResolveDialog onResolve={(note) => resolve(inc.id, note)} />}
                <Button size="icon" variant="ghost" onClick={() => remove(inc.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewIncidentDialog({ orders, onCreated }: { orders: { id: string; order_number: string; family_nom: string }[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [type, setType] = useState("autre");
  const [description, setDescription] = useState("");

  const submit = async () => {
    if (!orderId || !description.trim()) return toast.error("Commande et description requises");
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("order_incidents").insert({
      order_id: orderId, type, description: description.trim(), created_by: user?.id,
    });
    if (error) return toast.error(error.message);
    toast.success("Incident créé");
    setOpen(false); setOrderId(""); setType("autre"); setDescription("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />Nouvel incident</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Signaler un incident</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Commande</label>
            <Select value={orderId} onValueChange={setOrderId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
              <SelectContent>
                {orders.map((o) => <SelectItem key={o.id} value={o.id}>{o.order_number} — {o.family_nom}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INCIDENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={submit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResolveDialog({ onResolve }: { onResolve: (note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><CheckCircle2 className="mr-1 h-4 w-4" />Résoudre</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Résoudre l'incident</DialogTitle></DialogHeader>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note de résolution (optionnel)" rows={4} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={() => { onResolve(note); setOpen(false); setNote(""); }}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Onglet : Gestion des rôles APEL
// ============================================================
function RolesManager() {
  const [users, setUsers] = useState<RoleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("id, email, nom, prenom"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (pErr || rErr) { toast.error((pErr || rErr)!.message); setLoading(false); return; }
    const byUser = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const list = byUser.get(r.user_id) ?? [];
      list.push(r.role);
      byUser.set(r.user_id, list);
    });
    setUsers((profiles ?? []).map((p: any) => ({
      user_id: p.id, email: p.email, nom: p.nom, prenom: p.prenom,
      roles: byUser.get(p.id) ?? [],
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (userId: string, role: "apel" | "admin", currentlyHas: boolean) => {
    if (currentlyHas) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
      toast.success(`Rôle ${role} retiré`);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
      toast.success(`Rôle ${role} attribué`);
    }
    load();
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.nom?.toLowerCase().includes(q) || u.prenom?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-xs text-muted-foreground">
          {users.length} utilisateurs · {users.filter((u) => u.roles.includes("apel")).length} APEL · {users.filter((u) => u.roles.includes("admin")).length} admins
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Famille</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rôles actuels</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Chargement…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Aucun utilisateur.</td></tr>}
              {filtered.map((u) => {
                const hasApel = u.roles.includes("apel");
                const hasAdmin = u.roles.includes("admin");
                return (
                  <tr key={u.user_id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{u.prenom} {u.nom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {hasAdmin && <Badge>Admin</Badge>}
                        {hasApel && <Badge variant="secondary">APEL</Badge>}
                        {!hasAdmin && !hasApel && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={hasApel ? "outline" : "default"} onClick={() => toggleRole(u.user_id, "apel", hasApel)}>
                        {hasApel ? "Retirer APEL" : "Donner APEL"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}