import { Sparkles } from "lucide-react";

type Variant = "default" | "outer";

type Props = {
  size: string;
  variant?: Variant;
  className?: string;
};

/**
 * Harmonized badge displayed across the app for "Taille recommandée".
 * - default: 1ʳᵉ couche (t-shirt, polo, chemise)
 * - outer: ajoute la mention pour couches supérieures (pull, blazer)
 */
export function SizeBadge({ size, variant = "default", className = "" }: Props) {
  const isOuter = variant === "outer";
  return (
    <span
      title={
        isOuter
          ? "Taille recommandée pour les couches supérieures (pull, blazer, hoodie)"
          : "Taille recommandée pour une 1ʳᵉ couche (t-shirt, polo, chemise)"
      }
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset bg-[var(--teal)]/15 text-[var(--teal-deep)] ring-[var(--teal-deep)]/30 ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="opacity-80">{isOuter ? "Reco couche sup." : "Reco"}&nbsp;:</span>
      <span className="font-bold">{size}</span>
    </span>
  );
}