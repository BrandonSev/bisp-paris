import { useMemo } from "react";
import rawSvg from "@/assets/trousse-bisp.svg?raw";

type Props = {
  zipColor: string;
  className?: string;
};

/**
 * Rendu inline du SVG de la trousse, avec le zip recoloré dynamiquement.
 * Tous les éléments dont l'id commence par "zip" (ainsi que leurs descendants)
 * voient leur fill remplacé par la couleur sélectionnée.
 */
export function TrousseImage({ zipColor, className }: Props) {
  const html = useMemo(() => {
    if (typeof window === "undefined" || typeof DOMParser === "undefined") {
      return rawSvg;
    }
    const doc = new DOMParser().parseFromString(rawSvg, "image/svg+xml");
    const svg = doc.documentElement;
    if (!svg.hasAttribute("width") || !svg.hasAttribute("height")) {
      // ok
    }
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const apply = (el: Element) => {
      el.setAttribute("style", `fill: ${zipColor}`);
      el.removeAttribute("fill");
    };
    svg.querySelectorAll('[id^="zip"]').forEach((el) => {
      apply(el);
      el.querySelectorAll("path, rect, circle, polygon").forEach(apply);
    });
    return new XMLSerializer().serializeToString(svg);
  }, [zipColor]);

  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
