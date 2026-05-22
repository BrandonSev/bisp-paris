import { Hammer } from "lucide-react";

/**
 * Bandeau global "Site en cours de construction".
 * Affiché en haut de toutes les pages via __root.tsx.
 */
export function ConstructionBanner() {
  return (
    <div className="border-b border-[var(--rouge)]/30 bg-[var(--rouge)]/10 text-[var(--rouge)]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.15em] sm:px-6 lg:px-8">
        <Hammer className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Site en cours de construction — en attente de validation école</span>
      </div>
    </div>
  );
}
