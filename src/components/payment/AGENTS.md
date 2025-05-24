# Payment UI AGENTS.md

## Scope

Components under `/src/components/payment` handling CardCom subscription payment flows.

---

## Key Components & Files

- `PaymentSection.tsx` – Orchestrates payment UI/logic for all plans
- `PaymentIframe.tsx` – Embeds CardCom iframe, listens for postMessage
- `PaymentLoading.tsx`, `PaymentError.tsx` – UI for loading/error states
- `hooks/usePaymentInitialization.ts` – Calls Edge Function to get payment URL (by plan type)
- `utils/` – Helper logic (error handling, etc.)

---

## Coding & UX Standards

- Always show loading UI while waiting for payment URL
- Disable "Pay" button after click to prevent double payment
- Display clear error/success messages (in Hebrew)
- All payment results go through server-side verify function (NEVER trust only the client)
- Never expose CardCom credentials or sensitive tokens to the client

---

## Flow

1. User selects plan (`planData.ts`)
2. Call Edge Function to get payment URL
3. Render payment iframe (`PaymentIframe.tsx`)
4. On CardCom redirect, `payment-redirect.html` posts message and calls server-side verify
5. UI updates to success/fail accordingly

---

## Testing

- Mock Edge Function for unit tests
- E2E: Test all flows (success, failure, retries, redirect handling)

---

## Security

- Never store or display raw card/token info
- Only handle payment on server via Edge Functions

---

## Docs

- Update `/docs/PAYMENT_FLOW.md` for any changes in flow or plan logic

---

**Coordinate with `/supabase/functions/AGENTS.md` for any payment logic changes.**
