import { Link } from "@tanstack/react-router";
import { Hammer, ArrowLeft } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { PageWatermark } from "@/components/PageWatermark";

type Props = { title: string };

/**
 * Page placeholder « En cours de construction » pour les pages d'aide non
 * encore prêtes. Conserve la même structure (filigrane, header, footer) que
 * les autres pages /aide/*.
 */
export function UnderConstructionPage({ title }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background/80">
      <PageWatermark />
      <SiteHeader schoolName="BISP" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rouge)]/10 text-[var(--rouge)]">
          <Hammer className="h-7 w-7" />
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span className="h-px w-6 bg-[var(--rouge)]" /> Aide · Help
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Cette page est en cours de construction. Elle sera disponible prochainement. En attendant,
          vous pouvez consulter nos <Link to="/aide/cgv" className="text-primary underline-offset-2 hover:underline">CGV</Link>{" "}
          ou nos <Link to="/aide/cgu" className="text-primary underline-offset-2 hover:underline">CGU</Link>,
          ou nous écrire à{" "}
          <a href="mailto:info@franceuniforme.fr" className="text-primary underline-offset-2 hover:underline">
            info@franceuniforme.fr
          </a>
          .
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition-all hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
