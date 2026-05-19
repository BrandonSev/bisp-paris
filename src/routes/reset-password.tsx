import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import logo from "@/assets/bisp-logo.svg";
import { ShellMotif } from "@/components/SchoolMotif";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — BISP" },
      { name: "description", content: "Définissez un nouveau mot de passe pour votre espace famille BISP." },
    ],
  }),
  component: ResetPage,
});

const schema = z.object({
  password: z.string().min(8, "8 caractères minimum").max(128),
  confirm: z.string().min(8).max(128),
}).refine((d) => d.password === d.confirm, { message: "Les mots de passe ne correspondent pas", path: ["confirm"] });

function ResetPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Le lien Supabase pose un hash avec type=recovery et établit une session temporaire.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const isRecovery = hash.includes("type=recovery");
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") { setValid(true); setReady(true); }
    });
    // Vérification immédiate (session déjà restaurée)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && isRecovery) setValid(true);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Mot de passe mis à jour");
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="pointer-events-none absolute inset-0 text-primary">
        <ShellMotif className="absolute -left-40 top-20 h-[520px] w-[520px]" opacity={0.04} />
      </div>
      <div className="relative w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à la connexion
        </Link>
        <div className="mt-6 flex flex-col items-center text-center">
          <img src={logo} alt="BISP" className="h-20 w-20 object-contain" />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--teal-deep)]">
            <ShieldCheck className="h-3 w-3" /> Nouveau mot de passe
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Définir un nouveau mot de passe</h1>
          <p className="mt-1 text-sm italic text-muted-foreground">Set a new password</p>
        </div>

        {!ready ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">Vérification du lien…</p>
        ) : !valid ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-foreground">
            <p>Ce lien de réinitialisation est invalide ou expiré.</p>
            <Link to="/mot-de-passe-oublie" className="mt-3 inline-block text-[var(--teal-deep)] underline">Demander un nouveau lien</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Nouveau mot de passe (8 car. min.)">
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Confirmer le mot de passe">
              <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
            </Field>
            <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
              {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative mt-1.5">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}
