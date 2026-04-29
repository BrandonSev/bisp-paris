import { useMemo } from "react";
import rawSvg from "@/assets/trousse-bisp.svg?raw";

/** Couleur d'origine du zip dans le SVG fourni */
const ZIP_SOURCE = "#348397";

type Props = {
  zipColor: string;
  className?: string;
};

/**
 * Affiche la trousse BISP en remplaçant dynamiquement la couleur des
 * éléments "zip" (toutes les occurrences de fill="#348397" dans le SVG).
 */
export function TrousseSvg({ zipColor, className }: Props) {
  const svg = useMemo(() => {
    const escaped = ZIP_SOURCE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return rawSvg.replaceAll(new RegExp(`fill="${escaped}"`, "gi"), `fill="${zipColor}"`);
  }, [zipColor]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}