
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cb_payplug',
  ADD COLUMN IF NOT EXISTS payment_provider text,
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);

-- Allow users to update payment fields on their own orders (needed for retry flow)
DROP POLICY IF EXISTS "Users can update own orders payment" ON public.orders;
CREATE POLICY "Users can update own orders payment"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
