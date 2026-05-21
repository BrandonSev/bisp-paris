
ALTER TABLE public.family_parents RENAME COLUMN lien TO role;
ALTER TABLE public.family_parents RENAME COLUMN is_default_shipping TO is_shipping_default;

ALTER TABLE public.family_parents
  ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_alt_shipping boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shipping_label text,
  ADD COLUMN IF NOT EXISTS shipping_adresse text,
  ADD COLUMN IF NOT EXISTS shipping_code_postal text,
  ADD COLUMN IF NOT EXISTS shipping_ville text;

-- Marque le parent en position 0 comme parent principal pour les familles existantes
UPDATE public.family_parents fp
SET is_primary = true
WHERE position = 0
  AND NOT EXISTS (
    SELECT 1 FROM public.family_parents fp2
    WHERE fp2.user_id = fp.user_id AND fp2.is_primary = true
  );
