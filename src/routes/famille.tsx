import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, Users, Home, Save, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/famille")({
  head: () => ({
    meta: [
      { title: "Ma famille — BISP" },
      { name: "description", content: "Gérez les parents et l'adresse de livraison de votre espace famille BISP." },
    ],
  }),
  component: FamillePage,
});

type Parent = {
  id: string;
  civilite: string;
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  lien: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  is_default_shipping: boolean;
  position: number;
};

const EMPTY: Omit<Parent, "id" | "position"> = {
  civilite: "Mme", prenom: "", nom: "", email: "", telephone: "",
  lien: "Parent", adresse: "", code_postal: "", ville: "", is_default_shipping: false,
};

function FamillePage() {
  const { user, authLoading, profile, updateProfile } = useStore();
  const navigate = useNavigate();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<typeof EMPTY>(EMPTY);
  const [adding, setAdding] = useState(false);

  // profil famille
  const [familyName, setFamilyName] = useState("");
  const [codeEtab, setCodeEtab] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    setFamilyName(((profile as any)?.family_name as string) ?? "");
    setCodeEtab(((profile as any)?.code_etablissement as string) ?? "");
  }, [profile]);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await (supabase as any)
      .from("family_parents")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    setParents((data ?? []) as Parent[]);
    setLoading(false);
  };

  useEffect(() => { if (user) refresh(); }, [user]);

  const startEdit = (p: Parent) => {
    setEditId(p.id);
    setAdding(false);
    setDraft({
      civilite: p.civilite, prenom: p.prenom, nom: p.nom,
      email: p.email ?? "", telephone: p.telephone ?? "",
      lien: p.lien ?? "", adresse: p.adresse ?? "",
      code_postal: p.code_postal ?? "", ville: p.ville ?? "",
      is_default_shipping: p.is_default_shipping,
    });
  };

  const cancelEdit = () => { setEditId(null); setAdding(false); setDraft(EMPTY); };

  const save = async () => {
    if (!user) return;
    if (!draft.prenom.trim() || !draft.nom.trim()) { toast.error("Prénom et nom requis"); return; }
    const payload: any = {
      ...draft,
      email: draft.email || null,
      telephone: draft.telephone || null,
      lien: draft.lien || null,
      adresse: draft.adresse || null,
      code_postal: draft.code_postal || null,
      ville: draft.ville || null,
    };
    if (adding) {
      const { error } = await (supabase as any).from("family_parents").insert({
        ...payload, user_id: user.id, position: parents.length,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Parent ajouté");
    } else if (editId) {
      const { error } = await (supabase as any).from("family_parents").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); return; }
      toast.success("Parent mis à jour");
    }
    // si default activé, désactiver les autres
    if (payload.is_default_shipping) {
      await (supabase as any).from("family_parents")
        .update({ is_default_shipping: false })
        .eq("user_id", user.id)
        .neq("id", editId ?? "00000000-0000-0000-0000-000000000000");
    }
    cancelEdit();
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce parent ?")) return;
    const { error } = await (supabase as any).from("family_parents").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Parent supprimé");
    refresh();
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await (supabase as any).from("family_parents")
      .update({ is_default_shipping: false }).eq("user_id", user.id);
    await (supabase as any).from("family_parents")
      .update({ is_default_shipping: true }).eq("id", id);
    toast.success("Adresse de livraison par défaut mise à jour");
    refresh();
  };

  const saveProfile = async () => {
    try {
      await updateProfile({ family_name: familyName, code_etablissement: codeEtab } as any);
      toast.success("Informations famille enregistrées");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Ma famille</h1>
          <p className="mt-1 text-sm italic text-muted-foreground">My family — parents, contacts et adresse de livraison.</p>
        </div>

        {/* Identité famille */}
        <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users className="h-5 w-5 text-primary" /> Identité de la famille
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Nom de famille affiché et code établissement (si fourni par l'école).</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nom de famille">
              <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} maxLength={80} className={inputCls} />
            </Field>
            <Field label="Code établissement (optionnel)">
              <input value={codeEtab} onChange={(e) => setCodeEtab(e.target.value)} maxLength={40} className={inputCls} />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={saveProfile} className={primaryBtn}><Save className="h-4 w-4" /> Enregistrer</button>
          </div>
        </section>

        {/* Parents */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Home className="h-5 w-5 text-primary" /> Parents & adresses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Ajoutez les parents et choisissez l'adresse de livraison à utiliser par défaut au checkout.</p>
            </div>
            {!adding && !editId && (
              <button onClick={() => { setAdding(true); setEditId(null); setDraft(EMPTY); }} className={primaryBtn}>
                <Plus className="h-4 w-4" /> Ajouter un parent
              </button>
            )}
          </div>

          {(adding || editId) && (
            <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Civilité">
                  <select value={draft.civilite} onChange={(e) => setDraft({ ...draft, civilite: e.target.value })} className={inputCls}>
                    <option>Mme</option><option>M.</option><option>Autre</option>
                  </select>
                </Field>
                <Field label="Lien (ex. Père, Mère, Tuteur)">
                  <input value={draft.lien ?? ""} onChange={(e) => setDraft({ ...draft, lien: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Prénom *"><input value={draft.prenom} onChange={(e) => setDraft({ ...draft, prenom: e.target.value })} className={inputCls} /></Field>
                <Field label="Nom *"><input value={draft.nom} onChange={(e) => setDraft({ ...draft, nom: e.target.value })} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} /></Field>
                <Field label="Téléphone"><input value={draft.telephone ?? ""} onChange={(e) => setDraft({ ...draft, telephone: e.target.value })} className={inputCls} /></Field>
                <Field label="Adresse"><input value={draft.adresse ?? ""} onChange={(e) => setDraft({ ...draft, adresse: e.target.value })} className={inputCls} /></Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Code postal"><input value={draft.code_postal ?? ""} onChange={(e) => setDraft({ ...draft, code_postal: e.target.value })} className={inputCls} /></Field>
                  <div className="col-span-2">
                    <Field label="Ville"><input value={draft.ville ?? ""} onChange={(e) => setDraft({ ...draft, ville: e.target.value })} className={inputCls} /></Field>
                  </div>
                </div>
              </div>
              <label className="mt-4 inline-flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={draft.is_default_shipping} onChange={(e) => setDraft({ ...draft, is_default_shipping: e.target.checked })} />
                Utiliser cette adresse par défaut pour la livraison
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={cancelEdit} className={ghostBtn}><X className="h-4 w-4" /> Annuler</button>
                <button onClick={save} className={primaryBtn}><Save className="h-4 w-4" /> Enregistrer</button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Chargement…</p>
            ) : parents.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Aucun parent enregistré. Ajoutez le premier parent pour pouvoir choisir une adresse de livraison.
              </p>
            ) : parents.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{p.civilite} {p.prenom} {p.nom}</span>
                    {p.lien && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{p.lien}</span>}
                    {p.is_default_shipping && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--teal)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--teal-deep)]">
                        <Star className="h-3 w-3" /> Livraison par défaut
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {p.email && <span>{p.email}</span>}
                    {p.email && p.telephone && <span> · </span>}
                    {p.telephone && <span>{p.telephone}</span>}
                  </div>
                  {(p.adresse || p.code_postal || p.ville) && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {[p.adresse, [p.code_postal, p.ville].filter(Boolean).join(" ")].filter(Boolean).join(" — ")}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!p.is_default_shipping && p.adresse && (
                    <button onClick={() => setDefault(p.id)} className={ghostBtn} title="Définir comme livraison par défaut">
                      <Star className="h-4 w-4" /> Par défaut
                    </button>
                  )}
                  <button onClick={() => startEdit(p)} className={ghostBtn}><Pencil className="h-4 w-4" /> Modifier</button>
                  <button onClick={() => remove(p.id)} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-[var(--rouge)] hover:bg-muted">
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">
          Astuce : besoin de modifier votre identité principale (email, téléphone) ? Rendez-vous sur{" "}
          <Link to="/enfants" className="text-[var(--teal-deep)] underline">Mes enfants</Link>.
        </p>
      </main>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const primaryBtn = "inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90";
const ghostBtn = "inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-muted";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
