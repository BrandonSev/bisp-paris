import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

const NAV = [
  { to: "/aide/contact", label: "Contact" },
  { to: "/aide/livraison", label: "Livraison & retours" },
  { to: "/aide/guide-tailles", label: "Guide des tailles" },
  { to: "/aide/cgv", label: "CGV" },
  { to: "/aide/cgu", label: "CGU" },
  { to: "/aide/mentions-legales", label: "Mentions légales" },
  { to: "/aide/confidentialite", label: "Confidentialité" },
] as const;

export function HelpPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader schoolName="BISP" />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Aide · Help
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          )}
        </header>
        <div className="grid gap-10 lg:grid-cols-[220px,1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "bg-muted text-primary font-medium" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <article className="prose prose-sm max-w-none text-foreground prose-headings:text-primary prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-xl prose-h3:text-base prose-p:leading-relaxed prose-strong:text-foreground">
            {children}
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
