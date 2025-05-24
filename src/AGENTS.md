# Frontend (src) AGENTS.md

## Scope

All code under `/src`: UI, logic, Zustand stores, React contexts, custom hooks, pages, and local types.

---

## Structure

- `components/` – Reusable and feature-specific React components
- `pages/` – Route/page components (for React Router)
- `contexts/` – React contexts for global app state (auth, theme, subscription)
- `stores/` – Zustand state containers
- `hooks/` – Custom React hooks (data fetch, payment, etc.)
- `lib/` – Utility and service modules (API clients, helpers)
- `styles/` – Tailwind config and global CSS
- `types/` – Frontend-shared TypeScript types

---

## Coding Standards

- Use explicit prop types/interfaces for every component
- All components are functional (no classes)
- Use Tailwind utility classes for styling; avoid raw CSS
- UI must support RTL (use logical CSS: `ms-4`, not `ml-4`)
- Use shadcn-ui/Radix components for all UI primitives
- React state: use Zustand for global, React context for session/theme, props for local
- No secrets or sensitive data in client code!

---

## Validation

- Run `npm run lint` and fix all errors
- TypeScript must be 100% clean (`npm run build`)
- Use Playwright or manual browser tests for all user flows

---

## Contribution Guidelines

- Place new UI in `components/`, business logic in hooks or context
- All hooks/components should be unit-testable; use `__tests__/` as needed
- Add `data-testid` for critical elements for E2E stability

---

## Docs & Comments

- Update `/docs` if you introduce new design patterns or complex logic
- Add JSDoc comments for complex hooks or utilities

---

## Pitfalls

- Duplicating global state or context
- UI not aligned for RTL
- Leaving debug `console.log` or dead code
- Forgetting to update routes when adding pages

---

**For payment UI, see `/src/components/payment/AGENTS.md`**
