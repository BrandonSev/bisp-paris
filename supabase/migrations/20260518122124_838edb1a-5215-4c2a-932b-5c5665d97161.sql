-- Profiles : ajout colonnes famille
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS family_name text,
  ADD COLUMN IF NOT EXISTS code_etablissement text;

-- Table des parents (multi-parents par compte)
CREATE TABLE IF NOT EXISTS public.family_parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  civilite text NOT NULL DEFAULT 'Mme',
  prenom text NOT NULL,
  nom text NOT NULL,
  email text,
  telephone text,
  lien text,
  adresse text,
  code_postal text,
  ville text,
  is_default_shipping boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS family_parents_user_id_idx ON public.family_parents (user_id);

ALTER TABLE public.family_parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parents"
  ON public.family_parents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parents"
  ON public.family_parents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parents"
  ON public.family_parents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own parents"
  ON public.family_parents FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all parents"
  ON public.family_parents FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER family_parents_set_updated_at
  BEFORE UPDATE ON public.family_parents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();