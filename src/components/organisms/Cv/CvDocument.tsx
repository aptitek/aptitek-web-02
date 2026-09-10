import React, { useState, useMemo, useEffect } from "react";
import {
  CvToolbar,
  type SkillItem,
} from "~/components/molecules/CvToolbar/CvToolbar";
import defaultCvData from "../../../content/cv/cv-data.json";
import styles from "./CvDocument.module.css";

export interface CvDocumentProps {
  initialTheme?: "light" | "dark";
  cvData?: typeof defaultCvData;
  className?: string;
}

const SKILL_KEYWORDS: Record<string, string[]> = {
  ai: [
    "ia",
    "llm",
    "tensorflow",
    "langchain",
    "prompt",
    "intelligents",
    "thèse",
    "doctorat",
    "xai",
    "icaai",
  ],
  python: ["python", "développement", "code", "langchain", "tensorflow"],
  linux: ["linux", "docker", "bash", "virtualisation", "ipc", "systèmes"],
  network: [
    "réseau",
    "protocoles",
    "ccna",
    "routage",
    "encodage",
    "iot",
    "embarqués",
  ],
  teaching: [
    "former",
    "enseignement",
    "enseignant",
    "chercheur",
    "pédagogie",
    "moniteur",
    "polytech",
    "lyon 2",
    "cpe",
    "sciences-u",
    "estiam",
    "gema",
    "mache",
  ],
  research: [
    "recherche",
    "thèse",
    "doctorat",
    "publications",
    "liris",
    "planification",
    "jury",
    "icaps",
    "ijcai",
    "jfpda",
    "heart",
    "lollipop",
    "astro",
  ],
};

function highlightEntryForSkill(
  htmlContent: string,
  activeSkill: string | null,
): string {
  if (!activeSkill) return htmlContent;
  const keywords = SKILL_KEYWORDS[activeSkill];
  if (!keywords) return htmlContent;

  return htmlContent.replace(
    /<(section|div)\s+([^>]*?)class="entry([^"]*)"([^>]*)>([\s\S]*?)<\/\1>/gi,
    (...args: unknown[]) => {
      const tag = args[1] as string;
      const beforeClass = args[2] as string;
      const midClass = args[3] as string;
      const afterClass = args[4] as string;
      const inner = args[5] as string;
      const isMatch = keywords.some((kw) => {
        const regex = new RegExp(
          `(?:^|[^a-zA-ZÀ-ÿ0-9])${kw}(?:[^a-zA-ZÀ-ÿ0-9]|$)`,
          "i",
        );
        return regex.test(inner);
      });
      const matchClass = isMatch ? " skill-matched" : " skill-dimmed";
      return `<${tag} ${beforeClass}class="entry${midClass}${matchClass}"${afterClass}>${inner}</${tag}>`;
    },
  );
}

export const CvDocument: React.FC<CvDocumentProps> = ({
  initialTheme = "light",
  cvData = defaultCvData,
  className = "",
}) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(initialTheme);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", themeMode);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(themeMode);
      document.documentElement.style.colorScheme = themeMode;
    } catch {
      // Safe fallback for non-browser or test environments
    }
  }, [themeMode]);

  const skillItems: SkillItem[] = useMemo(() => {
    return (cvData.skills || []).map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color as SkillItem["color"],
    }));
  }, [cvData.skills]);

  const processedP1 = useMemo(
    () => highlightEntryForSkill(cvData.p1Html, selectedSkill),
    [cvData.p1Html, selectedSkill],
  );

  const processedP2 = useMemo(
    () => highlightEntryForSkill(cvData.p2Html, selectedSkill),
    [cvData.p2Html, selectedSkill],
  );

  const containerClasses = [
    styles.container,
    styles[`theme-${themeMode}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      data-theme={themeMode}
      data-hydrated={isHydrated}
      data-testid="cv-document"
    >
      <CvToolbar
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
        skills={skillItems}
        selectedSkill={selectedSkill}
        onSelectSkill={setSelectedSkill}
        pdfUrl="/cv.pdf"
        email={cvData.contact?.email}
        phone={cvData.contact?.phone}
      />

      <main className={styles.fluidContainer} data-testid="cv-fluid-view">
        <section className={styles.fluidCard} aria-label="Profil et Parcours">
          <div
            className={styles.fluidContent}
            dangerouslySetInnerHTML={{ __html: processedP1 }}
          />
        </section>

        <section
          className={styles.fluidCard}
          aria-label="Thèse et Publications"
        >
          <div
            className={styles.fluidContent}
            dangerouslySetInnerHTML={{ __html: processedP2 }}
          />
        </section>
      </main>
    </div>
  );
};
