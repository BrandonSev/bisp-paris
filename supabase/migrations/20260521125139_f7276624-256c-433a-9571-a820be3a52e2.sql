
-- 1. Extend order_incidents
ALTER TABLE public.order_incidents
  ADD COLUMN IF NOT EXISTS order_item_id uuid,
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS incident_type text,
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS photos text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Backfill compat avec colonnes existantes
UPDATE public.order_incidents SET incident_type = COALESCE(incident_type, type) WHERE incident_type IS NULL;
UPDATE public.order_incidents SET user_id = COALESCE(user_id, created_by) WHERE user_id IS NULL;

-- Trigger updated_at
DROP TRIGGER IF EXISTS set_order_incidents_updated_at ON public.order_incidents;
CREATE TRIGGER set_order_incidents_updated_at
  BEFORE UPDATE ON public.order_incidents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: la famille peut INSERT ses propres incidents
DROP POLICY IF EXISTS "Users can insert own incidents" ON public.order_incidents;
CREATE POLICY "Users can insert own incidents" ON public.order_incidents
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

-- 2. orders.delivered_at
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

-- 3. Storage bucket pour photos d'incident
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-photos', 'incident-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Policies bucket : lecture par l'owner (1er segment du path = user_id) + admin + apel
DROP POLICY IF EXISTS "incident_photos_select_owner" ON storage.objects;
CREATE POLICY "incident_photos_select_owner" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'incident-photos'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'apel'::public.app_role)
    )
  );

DROP POLICY IF EXISTS "incident_photos_insert_owner" ON storage.objects;
CREATE POLICY "incident_photos_insert_owner" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'incident-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "incident_photos_delete_owner" ON storage.objects;
CREATE POLICY "incident_photos_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'incident-photos'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::public.app_role)
    )
  );

-- 4. Fonction agrégée APEL
CREATE OR REPLACE FUNCTION public.apel_families_overview(_season_start date DEFAULT '2026-01-01'::date)
RETURNS TABLE(
  user_id uuid,
  family_civilite text,
  family_prenom text,
  family_nom text,
  family_email text,
  family_telephone text,
  ville text,
  children_count integer,
  classes text,
  paid_orders_count integer,
  items_count integer,
  last_paid_at timestamptz,
  has_ordered boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS user_id,
    p.civilite,
    p.prenom,
    p.nom,
    p.email,
    p.telephone,
    p.ville,
    COALESCE(c.cnt, 0)::int AS children_count,
    c.classes,
    COALESCE(o.paid_cnt, 0)::int AS paid_orders_count,
    COALESCE(o.items_cnt, 0)::int AS items_count,
    o.last_paid_at,
    COALESCE(o.paid_cnt, 0) > 0 AS has_ordered
  FROM public.profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS cnt,
           string_agg(DISTINCT NULLIF(classe, ''), ', ' ORDER BY NULLIF(classe, '')) AS classes
    FROM public.children
    GROUP BY user_id
  ) c ON c.user_id = p.id
  LEFT JOIN (
    SELECT o.user_id,
           COUNT(*) FILTER (WHERE o.paid_at IS NOT NULL) AS paid_cnt,
           COALESCE(SUM(CASE WHEN o.paid_at IS NOT NULL THEN it.total ELSE 0 END), 0) AS items_cnt,
           MAX(o.paid_at) AS last_paid_at
    FROM public.orders o
    LEFT JOIN (
      SELECT order_id, SUM(quantity)::int AS total
      FROM public.order_items GROUP BY order_id
    ) it ON it.order_id = o.id
    WHERE o.created_at >= _season_start
    GROUP BY o.user_id
  ) o ON o.user_id = p.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = p.id
      AND ur.role IN ('admin'::public.app_role, 'apel'::public.app_role)
  )
$$;

REVOKE ALL ON FUNCTION public.apel_families_overview(date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apel_families_overview(date) TO authenticated;
