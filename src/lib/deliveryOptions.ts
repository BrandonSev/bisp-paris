import { supabase } from "@/integrations/supabase/client";
import { featureFlags } from "@/config/featureFlags";

export type DeliveryOption = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  position: number;
};

const FALLBACK: DeliveryOption[] = [
  {
    id: "fallback-pickup",
    code: "pickup",
    label: "Retrait à l'établissement BISP",
    description: "Remis à votre enfant au secrétariat sous 5–7 jours ouvrés.",
    position: 1,
  },
  {
    id: "fallback-home",
    code: "home",
    label: "Livraison à domicile",
    description: "Expédition à l'adresse indiquée sous 5–8 jours ouvrés (frais en sus).",
    position: 2,
  },
];

function filter(opts: DeliveryOption[]): DeliveryOption[] {
  return opts.filter((o) => (o.code === "home" ? featureFlags.deliveryHome : true));
}

export async function fetchDeliveryOptions(): Promise<DeliveryOption[]> {
  const { data, error } = await supabase
    .from("delivery_options")
    .select("id, code, label, description, position")
    .eq("active", true)
    .order("position", { ascending: true });
  if (error || !data || data.length === 0) return filter(FALLBACK);
  return filter(data as DeliveryOption[]);
}