import { test, expect, type Page } from "@playwright/test";

interface Finding {
  type: string;
  selector: string;
  tag: string;
  property: string;
  value: string;
  isMask: boolean;
  isFlag: boolean;
  isVisible: boolean;
  textSnippet: string;
}

const auditPageElements = async (page: Page, themeMode: "dark" | "light") => {
  return await page.evaluate((mode: "dark" | "light") => {
    // Set theme on root
    document.documentElement.classList.remove("light", "dark", "debug");
    document.documentElement.classList.add(mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
    localStorage.setItem("aptispace_theme_mode", mode);

    const findings: Finding[] = [];
    const elements = Array.from(document.querySelectorAll("*"));

    const isInsideSvgMaskOrClip = (el: Element): boolean => {
      return !!el.closest("mask, clipPath");
    };

    const isFlagElement = (el: Element): boolean => {
      const cls = typeof el.className === "string" ? el.className : "";
      const testId = el.getAttribute("data-testid") || "";
      const id = el.id || "";
      return (
        cls.includes("flag") ||
        testId.includes("flag") ||
        id.includes("flag") ||
        !!el.closest("[data-testid*='flag'], [class*='flag'], [id*='flag']")
      );
    };

    const getSelector = (element: Element): string => {
      const parts: string[] = [];
      let curr: Element | null = element;
      while (
        curr &&
        curr !== document.body &&
        curr !== document.documentElement
      ) {
        let s = curr.tagName.toLowerCase();
        if (curr.id) {
          s += `#${curr.id}`;
          parts.unshift(s);
          break;
        } else if (curr.getAttribute("data-testid")) {
          s += `[data-testid="${curr.getAttribute("data-testid")}"]`;
        } else if (
          curr.className &&
          typeof curr.className === "string" &&
          curr.className.trim()
        ) {
          const c = curr.className.trim().split(/\s+/).slice(0, 2).join(".");
          if (c) s += `.${c}`;
        }
        parts.unshift(s);
        curr = curr.parentElement;
      }
      return parts.join(" > ");
    };

    for (const el of elements) {
      const tag = el.tagName.toLowerCase();
      if (
        [
          "script",
          "style",
          "meta",
          "head",
          "link",
          "noscript",
          "title",
          "astro-dev-toolbar",
        ].includes(tag) ||
        el.closest("astro-dev-toolbar")
      ) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const isMask = isInsideSvgMaskOrClip(el);
      const isFlag = isFlagElement(el);
      const selector = getSelector(el);
      const textSnippet = (el as HTMLElement).innerText
        ? (el as HTMLElement).innerText.trim().slice(0, 30)
        : "";

      const computed = window.getComputedStyle(el);
      const color = computed.color;
      const bg = computed.backgroundColor;
      const borderTop = computed.borderTopColor;
      const borderBottom = computed.borderBottomColor;
      const borderLeft = computed.borderLeftColor;
      const borderRight = computed.borderRightColor;
      const outline = computed.outlineColor;
      const boxShadow = computed.boxShadow;
      const fill = computed.fill;
      const stroke = computed.stroke;
      const fontFamily = computed.fontFamily;

      const inlineStyle = el.getAttribute("style") || "";

      const recordColor = (prop: string, val: string) => {
        if (
          !val ||
          val === "transparent" ||
          val === "none" ||
          val === "rgba(0, 0, 0, 0)"
        ) {
          return;
        }

        // Pure white: rgb(255, 255, 255) or #ffffff or #fff
        if (
          val === "rgb(255, 255, 255)" ||
          val === "#ffffff" ||
          val === "#fff" ||
          val === "white"
        ) {
          findings.push({
            type: "RAW_WHITE",
            selector,
            tag,
            property: prop,
            value: val,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }

        // Pure black: rgb(0, 0, 0) or #000000 or #000
        if (
          val === "rgb(0, 0, 0)" ||
          val === "#000000" ||
          val === "#000" ||
          val === "black"
        ) {
          findings.push({
            type: "RAW_BLACK",
            selector,
            tag,
            property: prop,
            value: val,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }

        // Alpha black or alpha white
        if (val.startsWith("rgba(0, 0, 0,")) {
          findings.push({
            type: "RAW_BLACK_ALPHA",
            selector,
            tag,
            property: prop,
            value: val,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }
        if (val.startsWith("rgba(255, 255, 255,")) {
          findings.push({
            type: "RAW_WHITE_ALPHA",
            selector,
            tag,
            property: prop,
            value: val,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }
      };

      recordColor("color", color);
      recordColor("backgroundColor", bg);
      recordColor("borderTopColor", borderTop);
      recordColor("borderBottomColor", borderBottom);
      recordColor("borderLeftColor", borderLeft);
      recordColor("borderRightColor", borderRight);
      recordColor("outlineColor", outline);

      if (boxShadow && boxShadow !== "none") {
        if (
          boxShadow.includes("rgb(0, 0, 0)") ||
          boxShadow.includes("rgba(0, 0, 0,")
        ) {
          findings.push({
            type: "BLACK_BOX_SHADOW",
            selector,
            tag,
            property: "boxShadow",
            value: boxShadow,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }
        if (
          boxShadow.includes("rgb(255, 255, 255)") ||
          boxShadow.includes("rgba(255, 255, 255,")
        ) {
          findings.push({
            type: "WHITE_BOX_SHADOW",
            selector,
            tag,
            property: "boxShadow",
            value: boxShadow,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }
      }

      if (tag === "svg" || el.closest("svg")) {
        recordColor("fill", fill);
        recordColor("stroke", stroke);
        const attrFill = el.getAttribute("fill");
        const attrStroke = el.getAttribute("stroke");
        if (attrFill) recordColor("attr:fill", attrFill);
        if (attrStroke) recordColor("attr:stroke", attrStroke);
      }

      if (inlineStyle) {
        if (
          /#(fff|ffffff|000|000000)\b/i.test(inlineStyle) ||
          /\b(white|black)\b/i.test(inlineStyle)
        ) {
          findings.push({
            type: "INLINE_RAW_STYLE",
            selector,
            tag,
            property: "style",
            value: inlineStyle,
            isMask,
            isFlag,
            isVisible,
            textSnippet,
          });
        }
      }

      // Check for broken default font family (e.g. Times New Roman fallback)
      if (
        fontFamily.includes("Times New Roman") ||
        fontFamily.includes("Times")
      ) {
        findings.push({
          type: "UNSTYLED_DEFAULT_FONT",
          selector,
          tag,
          property: "fontFamily",
          value: fontFamily,
          isMask,
          isFlag,
          isVisible,
          textSnippet,
        });
      }
    }

    return findings;
  }, themeMode);
};

import fs from "node:fs";
import path from "node:path";

test.describe("Design Token Audit: Raw White/Black and Non-Standard Values", () => {
  const reportPath =
    "/home/aptitek/.gemini/antigravity-ide/brain/18256935-8afb-48ac-a29b-6815c5c41d75/scratch/raw-values-report.json";

  const allReport: Record<string, Finding[]> = {};

  test.afterAll(() => {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(allReport, null, 2), "utf-8");
    console.warn(`\n>>> WROTE AUDIT REPORT TO ${reportPath} <<<\n`);
  });

  test("HomePage in dark mode", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("aptispace_theme_mode", "dark");
    });
    await page.goto("/");
    await page.waitForTimeout(500);

    const findings = await auditPageElements(page, "dark");
    allReport["HomePage_dark"] = findings;

    const pureWhiteBlack = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    console.warn(
      `[HomePage Dark] Pure white/black count: ${pureWhiteBlack.length}`,
    );
    expect(pureWhiteBlack).toEqual([]);
  });

  test("HomePage in light mode", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("aptispace_theme_mode", "light");
    });
    await page.goto("/");
    await page.waitForTimeout(500);

    const findings = await auditPageElements(page, "light");
    allReport["HomePage_light"] = findings;

    const pureWhiteBlack = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    console.warn(
      `[HomePage Light] Pure white/black count: ${pureWhiteBlack.length}`,
    );
    expect(pureWhiteBlack).toEqual([]);
  });

  test("CvPage in dark mode", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("aptispace_theme_mode", "dark");
    });
    await page.goto("/cv");
    await page.waitForSelector(
      '[data-testid="cv-document"][data-hydrated="true"]',
    );
    await page.waitForTimeout(500);

    const findings = await auditPageElements(page, "dark");
    allReport["CvPage_dark"] = findings;

    const pureWhiteBlack = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    console.warn(
      `[CvPage Dark] Pure white/black count: ${pureWhiteBlack.length}`,
    );
    expect(pureWhiteBlack).toEqual([]);
  });

  test("CvPage in light mode", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("aptispace_theme_mode", "light");
    });
    await page.goto("/cv");
    await page.waitForSelector(
      '[data-testid="cv-document"][data-hydrated="true"]',
    );
    await page.waitForTimeout(500);

    const findings = await auditPageElements(page, "light");
    allReport["CvPage_light"] = findings;

    const pureWhiteBlack = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    console.warn(
      `[CvPage Light] Pure white/black count: ${pureWhiteBlack.length}`,
    );
    expect(pureWhiteBlack).toEqual([]);
  });

  test("Interactive state: hover and theme toggle on CvPage", async ({
    page,
  }) => {
    await page.goto("/cv");
    await page.waitForSelector(
      '[data-testid="cv-document"][data-hydrated="true"]',
    );

    // Hover over theme toggle switch
    const themeToggle = page.getByTestId("zenith-theme-switch");
    await themeToggle.hover();
    await page.waitForTimeout(200);

    let findings = await auditPageElements(page, "dark");
    let pure = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    expect(pure).toEqual([]);

    // Hover over FloatingActionButton
    const fab = page.getByTestId("fab-pdf");
    await fab.hover();
    await page.waitForTimeout(200);

    findings = await auditPageElements(page, "dark");
    pure = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    expect(pure).toEqual([]);

    // Toggle to light theme via click
    await themeToggle.click();
    await page.waitForTimeout(400);

    findings = await auditPageElements(page, "light");
    pure = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    expect(pure).toEqual([]);
  });

  test("Mobile responsive layout audit on CvPage", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/cv");
    await page.waitForSelector(
      '[data-testid="cv-document"][data-hydrated="true"]',
    );
    await page.waitForTimeout(400);

    const findings = await auditPageElements(page, "dark");
    const pure = findings.filter(
      (f) =>
        !f.isMask &&
        !f.isFlag &&
        (f.type === "RAW_WHITE" || f.type === "RAW_BLACK"),
    );
    expect(pure).toEqual([]);
  });
});
