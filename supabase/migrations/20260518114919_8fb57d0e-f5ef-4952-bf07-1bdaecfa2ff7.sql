-- Delivery options
CREATE TABLE public.delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view delivery options"
  ON public.delivery_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert delivery options"
  ON public.delivery_options FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update delivery options"
  ON public.delivery_options FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete delivery options"
  ON public.delivery_options FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER delivery_options_set_updated_at
  BEFORE UPDATE ON public.delivery_options
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.delivery_options (code, label, description, position) VALUES
  ('pickup', 'Retrait à l''établissement BISP', 'Remis à votre enfant au secrétariat sous 5–7 jours ouvrés.', 1),
  ('home',   'Livraison à domicile',            'Expédition à l''adresse indiquée sous 5–8 jours ouvrés (frais en sus).', 2);

-- Orders extensions
ALTER TABLE public.orders
  ADD COLUMN shipping_mode      text NOT NULL DEFAULT 'pickup',
  ADD COLUMN shipping_label     text,
  ADD COLUMN shipping_recipient text,
  ADD COLUMN shipping_address   text,
  ADD COLUMN shipping_postal    text,
  ADD COLUMN shipping_city      text,
  ADD COLUMN paid_at            timestamptz,
  ADD COLUMN tracking_number    text,
  ADD COLUMN tracking_carrier   text;