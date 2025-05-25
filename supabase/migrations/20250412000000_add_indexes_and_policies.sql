-- Create indexes on subscriptions.user_id and user_payment_logs.user_id
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_payment_logs_user_id_idx ON public.user_payment_logs(user_id);

-- Ensure RLS is enabled on the tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to read/update only their own subscriptions
CREATE POLICY "Users can view their subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to read/update only their own payment logs
CREATE POLICY "Users can view their payment logs" ON public.user_payment_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their payment logs" ON public.user_payment_logs
  FOR UPDATE USING (auth.uid() = user_id);

