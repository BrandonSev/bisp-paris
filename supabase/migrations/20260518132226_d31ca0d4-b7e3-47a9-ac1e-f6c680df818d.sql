CREATE TABLE public.order_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'autre',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT
);

ALTER TABLE public.order_incidents ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_order_incidents_order_id ON public.order_incidents(order_id);
CREATE INDEX idx_order_incidents_status ON public.order_incidents(status);

CREATE POLICY "Admins and APEL can view all incidents"
  ON public.order_incidents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'apel'));

CREATE POLICY "Users can view incidents on their own orders"
  ON public.order_incidents FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_incidents.order_id AND o.user_id = auth.uid()));

CREATE POLICY "Admins and APEL can insert incidents"
  ON public.order_incidents FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'apel'));

CREATE POLICY "Admins and APEL can update incidents"
  ON public.order_incidents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'apel'));

CREATE POLICY "Admins can delete incidents"
  ON public.order_incidents FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "APEL can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'apel'));

CREATE POLICY "APEL can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'apel'));