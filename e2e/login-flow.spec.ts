import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('logs in and shows subscription details', async ({ page }) => {
    await page.goto('/auth');

    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
    expect(page.url()).not.toContain('/auth');

    await page.goto('/profile');
    await page.waitForSelector('[data-testid="user-subscription"]', { state: 'visible' });
    await expect(page.locator('[data-testid="user-subscription"]')).toBeVisible();
  });
});
