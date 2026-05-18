/**
 * Feature flags BISP.
 * Centralise les bascules de fonctionnalités optionnelles
 * pour permettre une activation progressive.
 */
export const featureFlags = {
  /** Active le mode "livraison à domicile" dans le checkout (en plus du retrait). */
  deliveryHome: true,
  /** Active le paiement en ligne (PayPlug/Stripe) à la confirmation de commande. */
  onlinePayment: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;