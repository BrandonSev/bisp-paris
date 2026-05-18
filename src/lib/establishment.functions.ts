/**
 * Establishment server functions.
 *
 * Prépare la migration vers un template maître multi-établissements.
 * Aujourd'hui : retourne la config statique de l'établissement courant.
 * Demain : pourra lire en base (table `establishments`) selon le sous-domaine
 * ou un header, sans changer la surface publique exposée aux composants.
 */
import { createServerFn } from "@tanstack/react-start";
import { establishment, featureFlags, type EstablishmentConfig, type FeatureFlag } from "@/config/featureFlags";

export type EstablishmentPayload = {
  establishment: EstablishmentConfig;
  features: Record<FeatureFlag, boolean>;
};

export const getEstablishment = createServerFn({ method: "GET" }).handler(
  async (): Promise<EstablishmentPayload> => {
    return {
      establishment,
      features: { ...featureFlags },
    };
  },
);
