-- Phase 1 — Foundation panier serveur + mesures enrichies enfants

-- 1. Table cart_items : panier persistant en DB (1 ligne = 1 produit/taille/enfant)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  ref TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  size TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  image TEXT DEFAULT '',
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_child_id ON public.cart_items(child_id);

-- 2. Mesures enrichies sur children
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS tour_taille TEXT,
  ADD COLUMN IF NOT EXISTS tour_bassin TEXT,
  ADD COLUMN IF NOT EXISTS genre TEXT;
