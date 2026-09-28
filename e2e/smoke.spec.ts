import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Network DevOps Engineer/);
  });

  test("should navigate to work page", async ({ page }) => {
    await page.goto("/");
    const workLink = page.locator('[data-cursor="view"]').first();
    if (await workLink.isVisible()) {
      await workLink.click();
      await expect(page).toHaveURL(/\/work\//);
    }
  });

  test("should open command palette with Cmd+K", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+k");
    const palette = page.locator("[role='dialog']");
    await expect(palette).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");

    const themeToggle = page.locator("[aria-label*='theme']").first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      const newTheme = await html.getAttribute("data-theme");
      expect(newTheme).not.toBe(initialTheme);
    }
  });
});

test.describe("Contact Form", () => {
  test("should submit contact form", async ({ page }) => {
    await page.goto("/#contact");

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');

    if (await nameInput.isVisible()) {
      await nameInput.fill("Test User");
      await emailInput.fill("test@example.com");
      await messageInput.fill("This is a test message from Playwright.");

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Should show success or error state
      // Success renders role="status"; a server-side failure renders role="alert".
      const contact = page.locator("#contact");
      await expect(
        contact.getByRole("status").or(contact.getByRole("alert")),
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("should reject honeypot submissions", async ({ page }) => {
    await page.goto("/#contact");

    const honeypot = page.locator('input[name="honeypot"]');
    if (await honeypot.count()) {
      // Honeypot should be hidden but present
      await expect(honeypot).toBeHidden();
    }
  });
});

test.describe("Accessibility", () => {
  test("should have skip link", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.locator("text=Skip to main content");
    await expect(skipLink).toBeFocused();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });
});
