# Public AGENTS.md

## Scope

Static files under `/public`: index.html, payment-redirect.html, assets.

---

## Payment Redirect

- `payment-redirect.html` is critical for CardCom payments. 
- Shows spinner, posts message to React app, calls verify function, and redirects.
- Only modify in sync with payment UI and backend functions.
- Never add any sensitive data or business logic here.

---

## General Rules

- Only final, production-ready files here (no TS/JSX/processing)
- No secrets or keys
- For images: optimize and use descriptive filenames
- If you change redirect logic, sync with both `/src/components/payment` and `/supabase/functions`

---

## Testing

- Test CardCom flow with real/sandbox params and see correct success/failure UI

---

**Do not place any private files or sensitive data here.**
