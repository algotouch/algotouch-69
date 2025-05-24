# AlgoTouch – Root AGENTS.md

Welcome to AlgoTouch, a modern React/TypeScript fintech platform with subscription management, CardCom payment integration, and robust security practices.

---

## Directory Overview

- `/src` – Frontend app (React, hooks, components, Zustand, etc.)
- `/supabase/functions` – Supabase Edge Functions (secure server logic, payments, webhooks)
- `/integrations` – Integrations with external services (Supabase client/types)
- `/public` – Static assets (index.html, payment-redirect.html, logos)
- `/e2e` – End-to-end Playwright tests
- `/docs` – Documentation (coding, design, performance, profiling)

**Each main folder has its own AGENTS.md with detailed, folder-specific instructions. Read them before contributing or modifying!**

---

## Contribution & Style Guidelines

- **TypeScript:** Strict mode only. No `any`. Use interfaces and clear types.
- **Naming:** PascalCase for components/types, camelCase for variables/functions, UPPER_SNAKE_CASE for constants.
- **React:** Functional, modular components only. Explicit prop types. Prefer composition and hooks.
- **Styling:** Tailwind CSS only. Use shadcn-ui and Radix UI for primitives.
- **RTL:** Hebrew (right-to-left) layout, dark mode support.
- **Security:** Never store secrets in client code. All sensitive logic must be in Edge Functions.
- **RLS:** All data access via Supabase with Row Level Security (RLS) enforced. Privileged actions only via server functions.

---

## Testing & Validation

- `npm run lint` for code linting
- `npm run build` and fix any TS/type errors
- `npx playwright test` for E2E
- Manually test user and payment flows in dev/staging environments

---

## PR/Commit Instructions

- Branch from `main`, descriptive branch names
- Add/update tests for all logic or UI changes
- PR title: `[<area>] <What you did>`
- Document in PR: summary, screenshots/logs, test plan, affected flows
- Update docs/AGENTS.md if behavior or API changes

---

## Agent Guidance

- **Explore:** Always read the most relevant (deepest) AGENTS.md in your working folder
- **Doc as you go:** Update AGENTS.md/docs if any rule or flow changes
- **Structure:** Place logic in the correct folder (UI in `/src`, business logic in `/supabase/functions`, types in `/integrations`)
- **Be explicit:** Add comments for non-trivial logic and security checks

---

## Pitfalls

- Don’t duplicate logic – search for existing hooks/components before adding new ones
- Never leak secrets or credentials to client or public
- Always test payment flows end-to-end, not just happy path

---

## Resources

- [React](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Supabase](https://supabase.com/docs)
- [CardCom](https://www.cardcom.solutions/docs/)
- [Tailwind](https://tailwindcss.com/docs)
