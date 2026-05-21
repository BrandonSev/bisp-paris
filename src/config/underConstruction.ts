/**
 * Routes affichées avec le composant `UnderConstructionPage`.
 *
 * Pour basculer une route en "En cours de développement", ajoutez son chemin
 * (tel que défini dans `createFileRoute`) à la map ci-dessous avec le titre
 * à afficher. Pour la remettre en ligne, retirez l'entrée (ou passez `false`).
 *
 * La route concernée doit appeler `useUnderConstruction(path)` (ou le helper
 * `isUnderConstruction`) et rendre `<UnderConstructionPage />` si actif.
 */
export const underConstructionRoutes: Record<string, string | false> = {
  "/aide/contact": "Contact",
  "/aide/livraison": "Livraison & retours",
  "/aide/guide-tailles": "Guide des tailles",
  // Exemples — décommentez pour activer :
  // "/aide/cgv": "Conditions Générales de Vente",
  // "/aide/cgu": "Conditions générales d'utilisation",
  // "/aide/mentions-legales": "Mentions légales",
  // "/aide/confidentialite": "Politique de confidentialité",
};

export function isUnderConstruction(path: string): string | null {
  const value = underConstructionRoutes[path];
  return typeof value === "string" && value.length > 0 ? value : null;
}