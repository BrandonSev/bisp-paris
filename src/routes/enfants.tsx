import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info, Plus, Ruler, Trash2, X } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ShellMotif } from "@/components/SchoolMotif";
import { useStore, type Child } from "@/lib/store";
import { toast } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { SizeBadge } from "@/components/SizeBadge";
import { recommendSize } from "@/lib/sizeRecommendation";

export const Route = createFileRoute("/enfants")({
  head: () => ({
    meta: [{ title: "Mes enfants · My children — BISP" }],
  }),
  component: () => (
    <RequireAuth>
      <EnfantsPage />
    </RequireAuth>
  ),
});

function EnfantsPage() {
  const { children: enfants, addChild, updateChild, removeChild, profile } = useStore();
  const [editing, setEditing] = useState<Child | null>(null);
  const [adding, setAdding] = useState(false);
  const familyName = profile?.nom || "votre famille";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-10 right-0 -z-0 h-72 w-72 text-primary">
          <ShellMotif className="h-full w-full" opacity={0.04} />
        </div>
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
              <span className="h-px w-6 bg-[var(--rouge)]" /> Famille {familyName}
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Mes enfants
            </h1>
            <p className="mt-1 text-sm italic text-muted-foreground">My children</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Profils de vos enfants scolarisés à BISP. Mettez à jour leurs mensurations
              pour des tailles toujours adaptées.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Ajouter · Add child
          </button>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-deep)]" />
          <p>Ces informations adaptent les tailles proposées dans la boutique. Données privées · private data.</p>
        </div>

        <div className="mt-8 space-y-5">
          {enfants.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">Aucun enfant enregistré.</p>
            </div>
          )}
          {enfants.map((e) => (
            <EnfantCard
              key={e.id}
              enfant={e}
              onEdit={() => setEditing(e)}
              onRemove={async () => {
                try { await removeChild(e.id); toast.success(`${e.prenom} retiré(e)`); }
                catch (err: any) { toast.error(err.message ?? "Erreur"); }
              }}
            />
          ))}
        </div>
      </section>

      {(editing || adding) && (
        <ChildModal
          initial={editing ?? undefined}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSubmit={async (data) => {
            try {
              if (editing) {
                await updateChild(editing.id, data);
                toast.success(`${data.prenom} mis à jour`);
              } else {
                await addChild(data);
                toast.success(`${data.prenom} ajouté(e)`);
              }
              setEditing(null);
              setAdding(false);
            } catch (err: any) {
              toast.error(err.message ?? "Erreur d'enregistrement");
            }
          }}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function EnfantCard({
  enfant,
  onEdit,
  onRemove,
}: {
  enfant: Child;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        <div className={`relative flex flex-col justify-between bg-gradient-to-br ${enfant.color} p-6`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-semibold text-primary shadow-sm">
            {enfant.initials}
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">{enfant.prenom} {enfant.nom}</h3>
            <p className="mt-1 text-xs text-foreground/70">Né(e) le · Born {enfant.naissance}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur">
              {enfant.section} · {enfant.classe}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" /> Mensurations · Measurements
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Hauteur · Height" value={enfant.hauteur} />
            <Field label="Tour poitrine · Chest" value={enfant.tour} />
            <Field label="Tour taille · Waist" value={enfant.tour_taille} />
            <Field label="Tour bassin · Hips" value={enfant.tour_bassin} />
            <Field label="Genre" value={enfant.genre} />
          </div>
          {(() => {
            const reco = recommendSize({
              hauteur: enfant.hauteur,
              tour: enfant.tour,
              tour_taille: enfant.tour_taille,
              tour_bassin: enfant.tour_bassin,
            });
            if (!reco) {
              return (
                <p className="mt-4 text-xs italic text-muted-foreground">
                  Renseignez au moins une mensuration pour obtenir une taille recommandée.
                </p>
              );
            }
            return (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <SizeBadge size={reco.row.age} />
                <Link to="/aide/guide-tailles" className="text-xs text-[var(--teal-deep)] hover:underline">
                  Voir le guide · Size guide
                </Link>
              </div>
            );
          })()}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--rouge)]"
            >
              <Trash2 className="h-3.5 w-3.5" /> Retirer
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted"
              >
                Modifier
              </button>
              <Link
                to="/boutique"
                className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}

type ChildFormData = Omit<Child, "id" | "initials" | "color">;

// Correspondance France ↔ UK (Maternelle → Lycée / Nursery → Sixth Form)
const CLASSES = [
  { section: "Maternelle", classe: "TPS", label: "Toute Petite Section — Pre-Nursery" },
  { section: "Maternelle", classe: "PS", label: "Petite Section — Nursery" },
  { section: "Maternelle", classe: "MS", label: "Moyenne Section — Reception" },
  { section: "Maternelle", classe: "GS", label: "Grande Section — Year 1" },
  { section: "Élémentaire", classe: "CP", label: "CP — Year 2" },
  { section: "Élémentaire", classe: "CE1", label: "CE1 — Year 3" },
  { section: "Élémentaire", classe: "CE2", label: "CE2 — Year 4" },
  { section: "Élémentaire", classe: "CM1", label: "CM1 — Year 5" },
  { section: "Élémentaire", classe: "CM2", label: "CM2 — Year 6" },
  { section: "Collège", classe: "6e", label: "6ᵉ — Year 7" },
  { section: "Collège", classe: "5e", label: "5ᵉ — Year 8" },
  { section: "Collège", classe: "4e", label: "4ᵉ — Year 9" },
  { section: "Collège", classe: "3e", label: "3ᵉ — Year 10" },
  { section: "Lycée", classe: "2nde", label: "Seconde — Year 11" },
  { section: "Lycée", classe: "1ère", label: "Première — Year 12 (Lower Sixth)" },
  { section: "Lycée", classe: "Tle", label: "Terminale — Year 13 (Upper Sixth)" },
] as const;

function ChildModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: Child;
  onClose: () => void;
  onSubmit: (data: ChildFormData) => void;
}) {
  const [form, setForm] = useState<ChildFormData>({
    prenom: initial?.prenom ?? "",
    nom: initial?.nom ?? "",
    naissance: initial?.naissance ?? "",
    classe: initial?.classe ?? "",
    section: initial?.section ?? "Élémentaire",
    taille: initial?.taille ?? "",
    hauteur: initial?.hauteur ?? "",
    tour: initial?.tour ?? "",
    tour_taille: initial?.tour_taille ?? "",
    tour_bassin: initial?.tour_bassin ?? "",
    genre: initial?.genre ?? "",
  });

  const set = <K extends keyof ChildFormData>(k: K, v: ChildFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const classKey = (section: string, classe: string) => `${section}|${classe}`;
  const liveReco = recommendSize({
    hauteur: form.hauteur,
    tour: form.tour,
    tour_taille: form.tour_taille,
    tour_bassin: form.tour_bassin,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-3xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {initial ? "Modifier l'enfant" : "Ajouter un enfant"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.prenom.trim() || !form.nom.trim()) {
              toast.error("Prénom et nom requis");
              return;
            }
            onSubmit(form);
          }}
          className="grid gap-4 p-6 sm:grid-cols-2"
        >
          <Input label="Prénom" value={form.prenom} onChange={(v) => set("prenom", v)} required />
          <Input label="Nom" value={form.nom} onChange={(v) => set("nom", v)} required />
          <Input label="Date de naissance" value={form.naissance} onChange={(v) => set("naissance", v)} placeholder="JJ/MM/AAAA" />
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Classe · Class (France · UK)
            </span>
            <select
              value={form.classe ? classKey(form.section, form.classe) : ""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) { set("classe", ""); return; }
                const found = CLASSES.find((c) => classKey(c.section, c.classe) === v);
                if (found) {
                  setForm((p) => ({ ...p, section: found.section, classe: found.classe }));
                }
              }}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">— Sélectionner une classe —</option>
              {(["Maternelle", "Élémentaire", "Collège", "Lycée"] as const).map((sec) => (
                <optgroup key={sec} label={sec}>
                  {CLASSES.filter((c) => c.section === sec).map((c) => (
                    <option key={classKey(c.section, c.classe)} value={classKey(c.section, c.classe)}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Genre</span>
            <select
              value={form.genre}
              onChange={(e) => set("genre", e.target.value as ChildFormData["genre"])}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">—</option>
              <option value="Fille">Fille · Girl</option>
              <option value="Garçon">Garçon · Boy</option>
            </select>
          </label>
          <Input label="Hauteur · Height (cm)" value={form.hauteur} onChange={(v) => set("hauteur", v)} placeholder="128" />
          <Input label="Tour de poitrine · Chest (cm)" value={form.tour} onChange={(v) => set("tour", v)} placeholder="62" />
          <Input label="Tour de taille · Waist (cm)" value={form.tour_taille} onChange={(v) => set("tour_taille", v)} placeholder="57" />
          <Input label="Tour de bassin · Hips (cm)" value={form.tour_bassin} onChange={(v) => set("tour_bassin", v)} placeholder="68" />
          {liveReco && (
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--teal)]/8 px-3 py-2">
              <SizeBadge size={liveReco.row.age} />
              <span className="text-xs text-muted-foreground">
                Suggestion automatique basée sur les mensurations saisies ·{" "}
                <Link to="/aide/guide-tailles" className="underline">Voir le guide</Link>
              </span>
            </div>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {initial ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
