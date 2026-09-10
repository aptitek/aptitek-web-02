import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  GitHub,
  LinkedIn,
  PersonRounded,
  LinkRounded,
  PhoneRounded,
  EmailRounded,
  LanguageRounded,
  CodeRounded,
  ShareRounded,
  WorkspacePremiumRounded,
  DirectionsCarRounded,
  HubRounded,
  TranslateRounded,
  TuneRounded,
  PsychologyRounded,
  TerminalRounded,
  Inventory2Rounded,
  SyncRounded,
  PaletteRounded,
  BusinessRounded,
  SchoolRounded,
  CalendarMonthRounded,
  LocationOnRounded,
  GavelRounded,
  DescriptionRounded,
  VisibilityRounded,
  GroupRounded,
  LightbulbRounded,
  ExploreRounded,
  MenuBookRounded,
  WorkRounded,
  KeyboardRounded,
  StorageRounded,
} from "@mui/icons-material";

const MUI_ICON_MAP: Record<string, React.ElementType> = {
  github: GitHub,
  linkedin: LinkedIn,
  "fa-github": GitHub,
  "fa-linkedin": LinkedIn,
  person: PersonRounded,
  link: LinkRounded,
  call: PhoneRounded,
  mail: EmailRounded,
  language: LanguageRounded,
  code: CodeRounded,
  share: ShareRounded,
  workspace_premium: WorkspacePremiumRounded,
  directions_car: DirectionsCarRounded,
  hub: HubRounded,
  translate: TranslateRounded,
  tune: TuneRounded,
  psychology: PsychologyRounded,
  terminal: TerminalRounded,
  inventory_2: Inventory2Rounded,
  sync: SyncRounded,
  palette: PaletteRounded,
  business: BusinessRounded,
  school: SchoolRounded,
  calendar_month: CalendarMonthRounded,
  location_on: LocationOnRounded,
  gavel: GavelRounded,
  description: DescriptionRounded,
  visibility: VisibilityRounded,
  group: GroupRounded,
  lightbulb: LightbulbRounded,
  explore: ExploreRounded,
  menu_book: MenuBookRounded,
  work: WorkRounded,
  keyboard: KeyboardRounded,
  database: StorageRounded,
};

function replaceIconsWithMuiSvg(html: string): string {
  const iconSpanRegex =
    /<span\s+[^>]*?class="([^"]*(?:material-symbols-rounded|md-icon|fa)[^"]*)"[^>]*>([^<]+)<\/span>/gi;

  return html.replace(iconSpanRegex, (fullMatch, classAttr, iconName) => {
    const trimmed = iconName.trim().toLowerCase();
    const IconComp = MUI_ICON_MAP[trimmed];
    if (!IconComp) {
      return fullMatch;
    }

    const colorClasses = classAttr
      .split(/\s+/)
      .filter((c: string) => c.startsWith("color-"))
      .join(" ");

    const className = `md-icon ${colorClasses}`.trim();
    const raw = ReactDOMServer.renderToStaticMarkup(
      React.createElement(IconComp, {
        className,
        fill: "currentColor",
        focusable: "false",
        "aria-hidden": "true",
      }),
    );

    return raw
      .replace(/<style[^>]*>.*?<\/style>/gs, "")
      .replace(/css-[a-z0-9]+-MuiSvgIcon-root/g, "")
      .replace(/\s{2,}/g, " ");
  });
}

const ROOT_DIR = process.cwd();
const CV_DIR = path.join(ROOT_DIR, "src/content/cv");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const QMD_PATH = path.join(CV_DIR, "cv.qmd");
const CSS_PATH = path.join(CV_DIR, "cv-print.css");
const OUTPUT_PDF = path.join(PUBLIC_DIR, "cv.pdf");
const GENERATED_HTML = path.join(CV_DIR, "cv-generated.html");
const GENERATED_JSON = path.join(CV_DIR, "cv-data.json");

export function buildCv() {
  console.log("🔨 Building CV from Quarto/Pandoc source...");

  if (!fs.existsSync(QMD_PATH)) {
    throw new Error(`CV source not found at ${QMD_PATH}`);
  }

  const rawMarkdown = fs.readFileSync(QMD_PATH, "utf-8");

  // Normalize line breaks & split page 1 and page 2 by ::: page-break
  const pageBreakRegex = /:::\s*page-break\s*(?::::)?/;
  const parts = rawMarkdown.split(pageBreakRegex);
  const p1Markdown = parts[0].trim();
  const p2Markdown = (parts[1] || "").trim();

  // Temporary markdown files for pandoc compilation
  const tempDir = path.join(ROOT_DIR, ".astro/cv-temp");
  fs.mkdirSync(tempDir, { recursive: true });

  const tempP1Md = path.join(tempDir, "p1.md");
  const tempP2Md = path.join(tempDir, "p2.md");

  fs.writeFileSync(tempP1Md, p1Markdown, "utf-8");
  fs.writeFileSync(tempP2Md, p2Markdown, "utf-8");

  const tokensCssPath = path.join(ROOT_DIR, "src/tokens/tokens.css");
  const tokensCss = fs.readFileSync(tokensCssPath, "utf-8");
  const printCss = fs.readFileSync(CSS_PATH, "utf-8");

  console.log("📄 Compiling Markdown with Pandoc...");
  // Use pandoc with github-markdown-extensions and raw HTML enabled
  const pandocArgs = "-f markdown+fenced_divs+bracketed_spans+raw_html -t html";

  const rawP1Html = execSync(`pandoc ${tempP1Md} ${pandocArgs}`, {
    cwd: CV_DIR,
    encoding: "utf-8",
  });
  const rawP2Html = execSync(`pandoc ${tempP2Md} ${pandocArgs}`, {
    cwd: CV_DIR,
    encoding: "utf-8",
  });

  function cleanSvg(
    svgContent: string,
    extraClass: string,
    label: string,
  ): string {
    return svgContent
      .replace(/<\?xml[^>]*\?>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<sodipodi:namedview[\s\S]*?\/>/gi, "")
      .replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
        // Remove hardcoded dimensions so CSS can control responsiveness, preserve viewBox
        const cleanedAttrs = attrs
          .replace(/\s*(width|height)="[^"]*"/gi, "")
          .replace(/\s*class="[^"]*"/gi, "");
        return `<svg class="${extraClass}" role="img" aria-label="${label}" ${cleanedAttrs.trim()}>`;
      })
      .trim();
  }

  function processImgAccessibilityAndLazyLoading(
    html: string,
    isPageBelowFold = false,
  ): string {
    const altMap: Record<string, string> = {
      "grea09.svg": "Photo de profil d'Antoine Gréa",
      "Aptitek.svg": "Logo Aptitek",
      "fr.svg": "Drapeau français",
      "en.svg": "Drapeau britannique",
      "es.svg": "Drapeau espagnol",
      "polytech_pastille.svg": "Logo Polytech Lyon",
      "lyon1_pastille.svg": "Logo Université Claude Bernard Lyon 1",
      "utbm_pastille.svg": "Logo UTBM",
      "b-and-d_pastille.svg": "Logo Business & Decision",
      "updv.svg": "Logo Universitat Politècnica De València",
      "lig.svg": "Logo LIG",
      "cril.svg": "Logo CRIL",
    };

    const isAboveTheFold = (src: string, classNames: string) => {
      if (isPageBelowFold) return false;
      if (classNames.includes("main-logo") || src.includes("grea09.svg"))
        return true;
      if (src.includes("Aptitek.svg")) return true;
      return false;
    };

    return html.replace(
      /<img\b([^>]*?)(\/?)>/gi,
      (_match, attrs, selfClose) => {
        let cleanAttrs = attrs.trim();

        // Check src
        const srcMatch = cleanAttrs.match(/src=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : "";
        const filename = path.basename(src);

        // Check class
        const classMatch = cleanAttrs.match(/class=["']([^"']+)["']/i);
        const classNames = classMatch ? classMatch[1] : "";

        // Check alt
        const altMatch = cleanAttrs.match(/alt=["']([^"']*)["']/i);
        const currentAlt = altMatch ? altMatch[1].trim() : "";

        let finalAlt = currentAlt;
        if (
          !altMatch ||
          !currentAlt ||
          currentAlt === "🇫🇷" ||
          currentAlt === "🇬🇧" ||
          currentAlt === "🇪🇸"
        ) {
          finalAlt =
            altMap[filename] ||
            (currentAlt && !currentAlt.match(/[\u{1F1E6}-\u{1F1FF}]/u)
              ? currentAlt
              : "Illustration");
        }

        if (altMatch) {
          cleanAttrs = cleanAttrs.replace(
            /alt=["'][^"']*["']/i,
            `alt="${finalAlt}"`,
          );
        } else {
          cleanAttrs += ` alt="${finalAlt}"`;
        }

        // Lazy loading:
        // Images under the fold get loading="lazy" decoding="async"
        // Images above the fold get loading="eager" decoding="async"
        const aboveFold = isAboveTheFold(src, classNames);
        const loadingVal = aboveFold ? "eager" : "lazy";

        if (/loading=["'][^"']*["']/i.test(cleanAttrs)) {
          cleanAttrs = cleanAttrs.replace(
            /loading=["'][^"']*["']/i,
            `loading="${loadingVal}"`,
          );
        } else {
          cleanAttrs += ` loading="${loadingVal}"`;
        }

        if (!/decoding=["'][^"']*["']/i.test(cleanAttrs)) {
          cleanAttrs += ` decoding="async"`;
        }

        const closing = selfClose ? " />" : ">";
        return `<img ${cleanAttrs.replace(/\s{2,}/g, " ")}${closing}`;
      },
    );
  }

  function unwrapFigures(html: string): string {
    return html.replace(
      /<figure>\s*(<img\b[\s\S]*?>)\s*<figcaption[\s\S]*?<\/figcaption>\s*<\/figure>/gi,
      "<p>$1</p>",
    );
  }

  function inlineJuryLogos(html: string): string {
    const updvPath = path.join(PUBLIC_DIR, "cv/icons/updv.svg");
    const ligPath = path.join(PUBLIC_DIR, "cv/icons/lig.svg");
    const crilPath = path.join(PUBLIC_DIR, "cv/icons/cril.svg");

    let out = html;

    if (fs.existsSync(updvPath)) {
      const updvSvg = cleanSvg(
        fs.readFileSync(updvPath, "utf-8"),
        "logo-updv",
        "Logo Universitat Politècnica De València",
      );
      out = out.replace(
        /<img\b[^>]*?src=["'][^"']*updv\.svg["'][^>]*>/gi,
        updvSvg,
      );
    }

    if (fs.existsSync(ligPath)) {
      const ligSvg = cleanSvg(
        fs.readFileSync(ligPath, "utf-8"),
        "logo-lig",
        "Logo LIG",
      );
      out = out.replace(
        /<img\b[^>]*?src=["'][^"']*lig\.svg["'][^>]*>/gi,
        ligSvg,
      );
    }

    if (fs.existsSync(crilPath)) {
      const crilSvg = cleanSvg(
        fs.readFileSync(crilPath, "utf-8"),
        "logo-cril",
        "Logo CRIL",
      );
      out = out.replace(
        /<img\b[^>]*?src=["'][^"']*cril\.svg["'][^>]*>/gi,
        crilSvg,
      );
    }

    // Remove artificial column constraints to allow snug fitting
    out = out.replace(/<colgroup>[\s\S]*?<\/colgroup>/gi, "");

    return out;
  }

  // Replace fontawesome / Material Symbols font ligatures with native MUI SVG Icons
  let p1Html = replaceIconsWithMuiSvg(rawP1Html);
  let p2Html = replaceIconsWithMuiSvg(rawP2Html);
  p2Html = inlineJuryLogos(p2Html);

  // Unwrap figure/figcaption if generated by Pandoc
  p1Html = unwrapFigures(p1Html);
  p2Html = unwrapFigures(p2Html);

  // Apply accessibility alt attributes and lazy loading
  p1Html = processImgAccessibilityAndLazyLoading(p1Html, false);
  p2Html = processImgAccessibilityAndLazyLoading(p2Html, true);

  // Construct full standalone HTML for WeasyPrint
  const standaloneHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Antoine Gréa — Curriculum Vitae</title>
  <base href="file://${PUBLIC_DIR}/"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Bebas+Neue&family=Biryani:wght@400;700&family=Open+Sans:ital,wght@0,400..800;1,400..800&family=Pacifico&family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&family=Roboto:ital,wght@0,400..700;1,400..700&display=swap"/>
  <style>
${printCss}
${tokensCss}
  </style>
</head>
<body>
  <div class="cv-sheet page-1">
    ${p1Html}
  </div>
  <div class="cv-sheet page-2">
    ${p2Html}
  </div>
</body>
</html>`;

  fs.writeFileSync(GENERATED_HTML, standaloneHtml, "utf-8");
  console.log(`✅ Generated standalone HTML at ${GENERATED_HTML}`);

  // Build PDF with WeasyPrint
  console.log("🖨️ Rendering PDF with WeasyPrint...");
  const weasyprintBin =
    process.env.WEASYPRINT_BIN ||
    path.join(process.env.HOME || "", ".local/bin/weasyprint");

  const env = {
    ...process.env,
    PATH: `${path.join(process.env.HOME || "", ".local/bin")}:${process.env.PATH}`,
  };

  try {
    execSync(`"${weasyprintBin}" "${GENERATED_HTML}" "${OUTPUT_PDF}"`, {
      env,
      stdio: "pipe",
    });
    const stats = fs.statSync(OUTPUT_PDF);
    console.log(
      `🎉 PDF successfully generated at ${OUTPUT_PDF} (${stats.size} bytes)`,
    );
  } catch (err: unknown) {
    console.warn(
      `⚠️ WeasyPrint direct call failed, falling back to uv run:`,
      err,
    );
    execSync(`uv run weasyprint "${GENERATED_HTML}" "${OUTPUT_PDF}"`, {
      env,
      stdio: "inherit",
    });
    const stats = fs.statSync(OUTPUT_PDF);
    console.log(
      `🎉 PDF generated via uv at ${OUTPUT_PDF} (${stats.size} bytes)`,
    );
  }

  // Extract structured data for React web component
  extractStructuredCv(rawMarkdown, p1Html, p2Html);

  // Clean temp files
  fs.rmSync(tempDir, { recursive: true, force: true });
}

function extractStructuredCv(_rawMd: string, p1Html: string, p2Html: string) {
  // Skills list extracted from Compétences section
  const skills = [
    {
      id: "ai",
      label: "IA & LLM",
      icon: "psychology",
      category: "tech",
      color: "magenta",
    },
    {
      id: "python",
      label: "Python",
      icon: "code",
      category: "dev",
      color: "violet",
    },
    {
      id: "linux",
      label: "Linux & Docker",
      icon: "terminal",
      category: "ops",
      color: "green",
    },
    {
      id: "network",
      label: "Réseau & Protocoles",
      icon: "hub",
      category: "infra",
      color: "blue",
    },
    {
      id: "teaching",
      label: "Pédagogie & Formation",
      icon: "school",
      category: "teaching",
      color: "yellow",
    },
    {
      id: "research",
      label: "Recherche & Algorithmique",
      icon: "menu_book",
      category: "research",
      color: "cyan",
    },
  ];

  const cvData = {
    title: "Antoine Gréa — Curriculum Vitae",
    name: "Antoine Gréa",
    role: "Dirigeant Aptitek & Docteur en IA",
    bio: "Docteur en IA et ingénieur système, je mets ma passion pour l'informatique au service d'une pédagogie active et de systèmes intelligents compréhensibles.",
    contact: {
      phone: "+33 7 66 77 21 26",
      email: "antoine@aptitek.io",
      website: "https://aptitek.io",
      github: "https://github.com/grea09",
      linkedin: "https://linkedin.com/in/grea09",
    },
    skills,
    p1Html,
    p2Html,
    lastGenerated: new Date().toISOString(),
  };

  fs.writeFileSync(GENERATED_JSON, JSON.stringify(cvData, null, 2), "utf-8");
  console.log(`📦 Saved structured CV data at ${GENERATED_JSON}`);
}

// Run if called directly
if (
  process.argv[1] &&
  import.meta.url.endsWith(path.basename(process.argv[1]))
) {
  buildCv();
}
