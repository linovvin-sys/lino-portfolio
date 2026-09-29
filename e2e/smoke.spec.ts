import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Network DevOps/);
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
      // The circular reveal applies the new theme on the next frame (View
      // Transitions snapshot the old page first), so wait for it rather than
      // reading the attribute synchronously.
      await expect(html).not.toHaveAttribute("data-theme", initialTheme ?? "");
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
