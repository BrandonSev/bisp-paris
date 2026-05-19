import type { ReactNode } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { PageWatermark } from "@/components/PageWatermark";

type Props = {
  title: string;
  updatedAt?: string;
  eyebrow?: string;
  children: ReactNode;
};

/**
 * Coquille des pages d'aide / légales — reprend la structure UI/UX du
 * projet Dax : filigrane, en-tête de site, eyebrow rouge, h1, date de mise
 * à jour, contenu en prose centré (max-w-3xl), pied de site complet.
 */
export function LegalPageShell({ title, updatedAt, eyebrow = "Légal", children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background/80">
      <PageWatermark />
      <SiteHeader schoolName="BISP" />
      <article className="mx-auto w-full max-w-3xl px-4 pt-6 pb-14 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span className="h-px w-6 bg-[var(--rouge)]" /> {eyebrow}
        </span>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {updatedAt && <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour : {updatedAt}</p>}
        <div className="prose prose-sm mt-8 max-w-none text-foreground/85 prose-headings:text-foreground prose-headings:font-semibold prose-h2:mt-6 prose-h2:text-lg prose-h3:mt-4 prose-h3:text-base prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm prose-li:leading-relaxed prose-strong:text-foreground prose-a:text-primary">
          {children}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
