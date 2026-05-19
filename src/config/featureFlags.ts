/**
 * Feature flags + segmentation établissement.
 *
 * Cette config prépare la migration vers un template maître multi-établissements :
 * - `establishment` décrit l'établissement courant (code, libellés, branding).
 * - `featureFlags` rassemble les bascules de fonctionnalités optionnelles.
 *
 * Pour dupliquer ce template sur un autre établissement, il suffira (à terme)
 * de remplacer cette config + `src/lib/establishment.functions.ts`.
 */

export type EstablishmentConfig = {
  /** Code court de l'établissement (slug stable, utilisé en base). */
  code: string;
  /** Nom court affiché (header, footer). */
  shortName: string;
  /** Nom complet officiel (mentions légales, PDF). */
  legalName: string;
  /** Ville pour le SEO et le footer. */
  city: string;
  /** Email de contact public. */
  contactEmail: string;
  /** Domaine d'envoi des emails transactionnels. */
  emailDomain: string;
  /** Adresse de retrait par défaut. */
  pickupAddress: string;
};

export const establishment: EstablishmentConfig = {
  code: "bisp",
  shortName: "BISP",
  legalName: "Bilingual International School of Paris",
  city: "Paris",
  contactEmail: "uniformes@bisp.fr",
  emailDomain: "notify.franceuniformes.fr",
  pickupAddress: "Bureau APEL — BISP, Paris",
};

export const featureFlags = {
  /** Active le mode "livraison à domicile" dans le checkout (en plus du retrait). */
  deliveryHome: true,
  /** Active le paiement en ligne (PayPlug/Stripe) à la confirmation de commande. */
  onlinePayment: true,
  /** Active la recommandation de taille automatique basée sur les mensurations. */
  sizeRecommendation: true,
  /** Active l'historique d'achat par enfant. */
  purchaseHistory: true,
  /** Active la gestion de parents multiples par famille. */
  multipleParents: true,
  /** Active la signalétique d'incidents côté famille (lecture seule). */
  familyIncidentVisibility: true,
  /** Active le tableau APEL (lecture seule des commandes). */
  apelDashboard: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag] === true;
}