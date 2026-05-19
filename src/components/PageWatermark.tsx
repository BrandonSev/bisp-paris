import schoolLogo from "@/assets/bisp-logo.svg";

/**
 * Filigrane de l'écusson BISP en très grand format, posé en arrière-plan
 * (fixed, derrière tout le contenu). Reprend l'ambiance du hero de la page
 * d'accueil pour l'harmonie visuelle.
 *
 * À placer une seule fois, en début du conteneur racine de la page.
 */
export function PageWatermark() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={schoolLogo}
        alt=""
        className="absolute left-1/2 top-1/2 h-[55rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 object-scale-down opacity-[0.045] mix-blend-multiply lg:h-[72rem] lg:w-[72rem]"
      />
    </div>
  );
}
