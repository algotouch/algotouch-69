# E2E AGENTS.md

## Scope

Playwright-based end-to-end tests under `/e2e`.

---

## Guidelines

- Structure: one spec file per feature/flow (`*.spec.ts`)
- Use `data-testid` for stable element selection
- Test critical flows: auth, dashboard, subscription, payments
- Performance budgets are enforced; update expectations responsibly
- Tests should run against a clean, staging, or test environment
- No test should alter or pollute real production data

---

## Running Tests

- `npx playwright test` for all tests
- To debug: run in headed mode or filter by file

---

## Docs

- Update `/docs/E2E.md` for major flow or test strategy changes

---

**If a feature is critical, add or update its E2E test before merging!**
