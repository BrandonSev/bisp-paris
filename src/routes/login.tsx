import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, ShieldCheck, User } from "lucide-react";
import logo from "@/assets/bisp-logo.png";
import classeBisp from "@/assets/classe-bisp.jpg";
import { ShellMotif } from "@/components/SchoolMotif";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Espace familles · Family portal — BISP" },
      {
        name: "description",
        content:
          "Connectez-vous à l'espace familles BISP pour commander vos uniformes officiels.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative flex flex-col bg-background">
        <div className="pointer-events-none absolute inset-0 text-primary">
          <ShellMotif className="absolute -left-40 top-20 h-[520px] w-[520px]" opacity={0.04} />
        </div>
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            BISP · Paris 15ᵉ
          </span>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt="BISP" className="h-32 w-32 object-contain drop-shadow-sm" />
              <div className="mt-5 h-1 w-12 rounded-full bg-[var(--rouge)]" />
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--teal-deep)]">
                <ShieldCheck className="h-3 w-3" /> Espace sécurisé · Secure
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                Espace familles
              </h1>
              <p className="mt-1 text-sm text-muted-foreground italic">Family portal</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Connectez-vous pour accéder à la boutique des uniformes
                <br />
                du Bilingual International School of Paris.
              </p>
            </div>

            <form className="mt-10 space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground">Nom de famille · Family name</label>
                <div className="relative mt-2">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ex. Dubois"
                    defaultValue="Dubois"
                    className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Mot de passe · Password</label>
                  <button type="button" className="text-xs text-[var(--teal-deep)] hover:underline">
                    Oublié ? · Forgot ?
                  </button>
                </div>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                    className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <Link
                to="/boutique"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:bg-primary/90"
              >
                Accéder à la boutique · Sign in
              </Link>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">ou · or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Créer mon espace · Create account
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              En vous connectant, vous acceptez les{" "}
              <span className="text-[var(--teal-deep)]">conditions générales</span> et notre{" "}
              <span className="text-[var(--teal-deep)]">politique de confidentialité</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="relative hidden lg:block">
        <img
          src={classeBisp}
          alt="Élèves BISP en classe"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-deep/90 via-primary/50 to-transparent" />
        <div className="absolute top-10 right-10">
          <img src={logo} alt="" className="h-20 w-20 object-contain drop-shadow-2xl opacity-90" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <blockquote className="max-w-md font-display text-2xl font-light leading-snug italic">
            « Simply exceptional. »
          </blockquote>
          <p className="mt-4 text-sm text-white/80">
            — Bilingual International School of Paris
          </p>
        </div>
      </div>
    </div>
  );
}
