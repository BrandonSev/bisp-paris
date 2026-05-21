import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import logo from "@/assets/bisp-logo.svg";
import classeBisp from "@/assets/classe-bisp.jpg";
import { ShellMotif } from "@/components/SchoolMotif";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";
import { verifyEstablishmentCode } from "@/lib/establishment-code.functions";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Espace familles · Family portal — BISP" },
      { name: "description", content: "Connectez-vous ou créez votre espace famille BISP." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? ("signup" as const) : undefined,
  }),
  component: LoginPage,
});

const signinSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum").max(128),
});

const signupSchema = z.object({
  civilite: z.enum(["M.", "Mme", "Autre"]),
  prenom: z.string().trim().min(1, "Prénom requis").max(80),
  nom: z.string().trim().min(1, "Nom requis").max(80),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z
    .string()
    .trim()
    .min(6, "Téléphone portable requis")
    .max(30, "Téléphone trop long")
    .regex(/^[0-9 +().\-]+$/, "Numéro de téléphone invalide"),
  adresse: z.string().trim().min(1, "Adresse requise").max(200),
  code_postal: z.string().trim().min(4, "Code postal requis").max(10),
  ville: z.string().trim().min(1, "Ville requise").max(100),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum").max(128),
  code_etablissement: z.string().trim().min(1, "Code établissement requis").max(64),
});

function LoginPage() {
  const search = useSearch({ from: "/login" });
  const [mode, setMode] = useState<"signin" | "signup">(search.mode === "signup" ? "signup" : "signin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, authLoading } = useStore();

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/boutique" });
  }, [user, authLoading, navigate]);

  // form state
  const [civilite, setCivilite] = useState<"M." | "Mme" | "Autre">("Mme");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [password, setPassword] = useState("");
  const [codeEtablissement, setCodeEtablissement] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signinSchema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? "Identifiants invalides" : error.message); return; }
    toast.success("Bienvenue !");
    navigate({ to: "/boutique" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse({
      civilite,
      prenom,
      nom,
      email,
      telephone,
      adresse,
      code_postal: codePostal,
      ville,
      password,
      code_etablissement: codeEtablissement,
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      const check = await verifyEstablishmentCode({ data: { code: parsed.data.code_etablissement } });
      if (!check.valid) {
        setLoading(false);
        toast.error(
          check.reason === "not_configured"
            ? "La validation du code établissement est temporairement indisponible. Contactez l'établissement."
            : "Code établissement invalide. Contactez l'établissement si vous n'en avez pas reçu.",
        );
        return;
      }
    } catch {
      setLoading(false);
      toast.error("Impossible de vérifier le code établissement. Réessayez.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/boutique`,
        data: {
          civilite: parsed.data.civilite,
          prenom: parsed.data.prenom,
          nom: parsed.data.nom,
          telephone: parsed.data.telephone,
          adresse: parsed.data.adresse,
          code_postal: parsed.data.code_postal,
          ville: parsed.data.ville,
          code_etablissement: parsed.data.code_etablissement,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Cet email est déjà utilisé" : error.message);
      return;
    }
    // Persiste les infos postales sur le profil après création
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (u) {
      await supabase
        .from("profiles")
        .update({
          adresse: parsed.data.adresse,
          code_postal: parsed.data.code_postal,
          ville: parsed.data.ville,
          telephone: parsed.data.telephone,
          code_etablissement: parsed.data.code_etablissement,
        })
        .eq("id", u.id);
    }
    toast.success("Espace famille créé !");
    navigate({ to: "/boutique" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col bg-background">
        <div className="pointer-events-none absolute inset-0 text-primary">
          <ShellMotif className="absolute -left-40 top-20 h-[520px] w-[520px]" opacity={0.04} />
        </div>
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">BISP · Paris 15ᵉ</span>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt="BISP" className="h-24 w-24 object-contain drop-shadow-sm" />
              <div className="mt-4 h-1 w-12 rounded-full bg-[var(--rouge)]" />
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--teal)]/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--teal-deep)]">
                <ShieldCheck className="h-3 w-3" /> Espace sécurisé
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                {mode === "signin" ? "Espace familles" : "Créer mon espace famille"}
              </h1>
              <p className="mt-1 text-sm italic text-muted-foreground">
                {mode === "signin" ? "Family portal" : "Create your family account"}
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-8 grid grid-cols-2 rounded-xl border border-border bg-secondary p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`h-9 rounded-lg transition-colors ${mode === "signin" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`h-9 rounded-lg transition-colors ${mode === "signup" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
              >
                Créer un espace
              </button>
            </div>

            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <Field label="Email · Email" icon={<Mail className="h-4 w-4" />}>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" className={inputCls} />
                </Field>
                <Field label="Mot de passe · Password" icon={<Lock className="h-4 w-4" />}>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                </Field>
                <div className="flex justify-end -mt-2">
                  <Link to="/mot-de-passe-oublie" className="text-xs text-[var(--teal-deep)] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <button type="submit" disabled={loading} className={primaryBtn}>
                  {loading ? "Connexion…" : "Accéder à la boutique"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Civilité</span>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["Mme", "M.", "Autre"] as const).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCivilite(c)}
                        className={`h-10 rounded-lg border text-sm font-medium transition-colors ${civilite === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Prénom" icon={<UserIcon className="h-4 w-4" />}>
                    <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} maxLength={80} className={inputCls} />
                  </Field>
                  <Field label="Nom" icon={<UserIcon className="h-4 w-4" />}>
                    <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} maxLength={80} className={inputCls} />
                  </Field>
                </div>
                <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Téléphone portable" icon={<Phone className="h-4 w-4" />}>
                  <input type="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)} maxLength={30} placeholder="06 12 34 56 78" className={inputCls} />
                </Field>
                <Field label="Adresse postale" icon={<MapPin className="h-4 w-4" />}>
                  <AddressAutocomplete
                    value={adresse}
                    onChange={setAdresse}
                    onSelect={({ adresse: a, code_postal, ville: v }) => {
                      setAdresse(a);
                      setCodePostal(code_postal);
                      setVille(v);
                    }}
                    required
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <Field label="Code postal" icon={<MapPin className="h-4 w-4" />}>
                    <input type="text" required value={codePostal} onChange={(e) => setCodePostal(e.target.value)} maxLength={10} placeholder="75015" className={inputCls} />
                  </Field>
                  <Field label="Ville" icon={<MapPin className="h-4 w-4" />}>
                    <input type="text" required value={ville} onChange={(e) => setVille(e.target.value)} maxLength={100} placeholder="Paris" className={inputCls} />
                  </Field>
                </div>
                <Field label="Mot de passe (8 car. min.)" icon={<Lock className="h-4 w-4" />}>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} className={inputCls} />
                </Field>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Code établissement
                    </label>
                    <span className="group relative inline-flex cursor-help items-center text-muted-foreground" tabIndex={0}>
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span className="pointer-events-none absolute right-0 top-5 z-30 w-64 rounded-lg border border-border bg-card p-3 text-left text-[11px] leading-snug text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                        Le code établissement vous a été transmis par l'école. Si vous ne l'avez pas reçu, contactez le secrétariat de BISP.
                      </span>
                    </span>
                  </div>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={codeEtablissement}
                      onChange={(e) => setCodeEtablissement(e.target.value)}
                      maxLength={64}
                      placeholder="Code transmis par l'établissement"
                      className={inputCls}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className={primaryBtn}>
                  {loading ? "Création…" : "Créer mon espace famille"}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-muted-foreground">
              En continuant, vous acceptez les{" "}
              <Link to="/aide/cgu" className="text-[var(--teal-deep)] hover:underline">
                CGU
              </Link>{" "}
              et notre{" "}
              <Link to="/aide/confidentialite" className="text-[var(--teal-deep)] hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img src={classeBisp} alt="Élèves BISP en classe" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-deep/90 via-primary/50 to-transparent" />
        <div className="absolute top-10 right-10">
          <img src={logo} alt="" className="h-20 w-20 object-contain drop-shadow-2xl opacity-90" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <blockquote className="max-w-md font-display text-2xl font-light leading-snug italic">« Simply exceptional. »</blockquote>
          <p className="mt-4 text-sm text-white/80">— Bilingual International School of Paris</p>
        </div>
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
const primaryBtn = "inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:bg-primary/90 disabled:opacity-60";

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  );
}
