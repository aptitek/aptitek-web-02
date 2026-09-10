import { test, expect } from "@playwright/test";

test.describe("Static Website Smoke Tests", () => {
  test("should load the home page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AptiTek|Astro/i);
    const mainHeading = page.locator("main h1").first();
    await expect(mainHeading).toBeVisible();
  });
});
