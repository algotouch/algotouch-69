# Supabase Edge Functions AGENTS.md

## Scope

All server-side logic (TypeScript, Deno) under `/supabase/functions`: payments, verification, webhooks, secure operations.

---

## Structure

- Each function in its own folder (e.g., `cardcom-payment`, `verify-cardcom-payment`)
- Index file per function (e.g., `index.ts`)
- All secrets from environment variables only (never in code)
- Use Supabase admin client with service key for privileged ops

---

## Coding & Security Standards

- Always handle CORS preflight
- Validate every input – never trust request data blindly
- Log all important events (DB `payment_logs` and console)
- Sensitive logic (like payment verification, subscription upgrade) must run here, never in client
- If you change DB schema, also regenerate Supabase types for client (`/integrations/supabase/types.ts`)
- Use idempotency (don’t double-process webhooks/payments)
- Always add/verify correct CORS headers

---

## Testing & Deployment

- Test locally: `supabase functions serve <name>`
- CI: Deploy via Supabase CLI or GitHub Actions
- Use staging env and test CardCom sandbox credentials when possible
- Manually verify full payment cycle after updates

---

## Docs

- Document new/changed functions in `/docs/payment-architecture.md` and AGENTS.md

---

**Never expose or use service keys/tokens in the frontend.**
