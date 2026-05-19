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
        <div
          className={[
            "mt-8 max-w-none text-foreground/85",
            // Headings — match Dax spacing/sizing exactly
            "[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground",
            "[&_h2:first-child]:mt-8",
            "[&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
            // Body
            "[&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed",
            // Lists
            "[&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-relaxed",
            "[&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:leading-relaxed",
            "[&_li]:text-sm [&_li]:leading-relaxed",
            // Inline
            "[&_strong]:font-semibold [&_strong]:text-foreground",
            "[&_a]:text-primary [&_a]:underline hover:[&_a]:no-underline",
            "[&_em]:italic",
          ].join(" ")}
        >
          {children}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
