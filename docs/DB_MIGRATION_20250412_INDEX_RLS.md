# Database Migration: Indexes and RLS Policies

This migration adds performance indexes and row level security rules.

## Changes
- **Indexes**: `subscriptions(user_id)` and `user_payment_logs(user_id)`.
- **RLS policies**: users can read and update only their own records in both tables.

Run the migration via Supabase CLI and regenerate the client types after applying it:
```sh
supabase db push
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

