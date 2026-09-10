import { test, expect } from "@playwright/test";

test.describe("CV Fluid Web Layout & Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
    await page.waitForSelector(
      '[data-testid="cv-document"][data-hydrated="true"]',
    );
  });

  test("should render the fluid web layout without A4 sheet simulation controls", async ({
    page,
  }) => {
    // Check title and meta
    await expect(page).toHaveTitle(/Curriculum Vitae.*Antoine Gréa/i);

    // Fluid container must exist
    const fluidView = page.getByTestId("cv-fluid-view");
    await expect(fluidView).toBeVisible();

    // Verify absence of obsolete A4 sheet pagination and controls
    await expect(page.getByText(/Planche A4/i)).toHaveCount(0);
    await expect(page.getByText(/Page 1 \/ 2/i)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /imprimer \(a4\)/i }),
    ).toHaveCount(0);
  });

  test("should provide a direct link to the WeasyPrint compiled PDF via Floating Action Button", async ({
    page,
  }) => {
    const pdfLink = page.getByTestId("fab-pdf");
    await expect(pdfLink).toBeVisible();
    await expect(pdfLink).toHaveAttribute("href", "/cv.pdf");
    await expect(pdfLink).toHaveAttribute("download", "CV-Antoine-Grea.pdf");
  });

  test("should display sidebar and main-content with native CSS typography and sections", async ({
    page,
  }) => {
    // Main logo in sidebar
    const mainLogo = page.locator("img.main-logo");
    await expect(mainLogo).toBeVisible();

    // Antoine Gréa heading
    const h1 = page.locator(".sidebar h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Antoine");

    // Headings have Bebas Neue typography
    const headings = page.locator("main h2");
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Check that Thèse and Publications sections exist
    await expect(page.locator("h2").filter({ hasText: "Thèse" })).toBeVisible();
    await expect(
      page.locator("h2").filter({ hasText: "Publications" }),
    ).toBeVisible();

    // Jury table exists
    const juryTable = page.locator(".thesis table");
    await expect(juryTable).toBeVisible();
    await expect(juryTable.getByText(/Directeur de thèse/i)).toBeVisible();
  });

  test("should toggle between Solarized light and dark themes via page theme switch", async ({
    page,
  }) => {
    const docEl = page.locator("html");

    const themeToggle = page.getByTestId("zenith-theme-switch");
    await expect(themeToggle).toBeVisible();

    const initialTheme = await docEl.getAttribute("data-theme");
    await themeToggle.click();
    await expect(docEl).not.toHaveAttribute("data-theme", initialTheme || "");
  });

  test("should not render the removed toolbar headerbar", async ({ page }) => {
    await expect(
      page.locator('aside[aria-label="Commandes du CV"]'),
    ).toHaveCount(0);
    await expect(page.getByText(/filtrer par compétences/i)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /copier email/i }),
    ).toHaveCount(0);
  });

  test("should render responsively on mobile without horizontal page overflow", async ({
    page,
  }) => {
    // Set to iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // Check sidebar and main content are both visible
    const sidebar = page.locator(".sidebar");
    const mainContent = page.locator(".main-content");
    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();

    // Verify that the document does not overflow horizontally
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test("should have accessible alt text and lazy loading on all images", async ({
    page,
  }) => {
    // Check all img tags within the CV document
    const images = page.locator('[data-testid="cv-document"] img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");
      const loading = await img.getAttribute("loading");
      const decoding = await img.getAttribute("decoding");

      // Accessibility: every image must have a descriptive non-empty alt
      expect(
        alt,
        `Image ${src} must have a non-empty alt attribute`,
      ).toBeTruthy();
      expect(alt?.trim().length).toBeGreaterThan(2);

      // Performance: all images must have async decoding
      expect(decoding, `Image ${src} should have decoding="async"`).toBe(
        "async",
      );

      // Lazy-loading: images under the fold (pastilles, flags) must have loading="lazy"
      if (src?.includes("pastille") || src?.includes("flags")) {
        expect(
          loading,
          `Image ${src} under the fold should have loading="lazy"`,
        ).toBe("lazy");
      }

      // Above the fold images (avatar, header logo) have loading="eager"
      if (src?.includes("grea09") || (src?.includes("Aptitek") && i === 1)) {
        expect(
          loading,
          `Hero image ${src} above the fold should have loading="eager"`,
        ).toBe("eager");
      }
    }
  });
});
