import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import logo from "@/assets/bisp-logo.png";
import { ShellMotif } from "@/components/SchoolMotif";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — BISP" },
      { name: "description", content: "Réinitialisez le mot de passe de votre espace famille BISP." },
    ],
  }),
  component: ForgotPage,
});

const schema = z.object({ email: z.string().trim().email("Email invalide").max(255) });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Email envoyé");
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
            <ShieldCheck className="h-3 w-3" /> Espace sécurisé
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Mot de passe oublié</h1>
          <p className="mt-1 text-sm italic text-muted-foreground">Forgot password</p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-foreground">
            <p>Si un compte existe pour <span className="font-semibold">{email}</span>, vous recevrez un email avec un lien pour définir un nouveau mot de passe.</p>
            <p className="mt-3 text-muted-foreground">Pensez à vérifier vos spams. Le lien est valable 1 heure.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email · Email</label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
              {loading ? "Envoi…" : "Recevoir le lien de réinitialisation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
