# End-to-End Tests

This project uses **Playwright** for all automated browser tests. Tests live under the `/e2e` directory and are executed for multiple browsers as defined in `playwright.config.ts`.

## Login Flow

The `login-flow.spec.ts` test covers a basic authentication scenario:

1. Navigate to `/auth` and submit valid credentials.
2. Verify the app redirects to `/dashboard` and does not bounce back to `/auth`.
3. Visit `/profile` and ensure subscription details render using `data-testid` hooks from `UserSubscription`.

Run all tests with:

```bash
npx playwright test
```

Refer to `e2e/AGENTS.md` for guidelines on writing additional scenarios.
