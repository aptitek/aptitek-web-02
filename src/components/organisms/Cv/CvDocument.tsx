import React, { useState, useEffect } from "react";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { FloatingActionButton } from "~/components/atoms/FloatingActionButton";
import defaultCvData from "../../../content/cv/cv-data.json";
import styles from "./CvDocument.module.css";

export interface CvDocumentProps {
  initialTheme?: "light" | "dark";
  cvData?: typeof defaultCvData;
  className?: string;
  pdfUrl?: string;
  pdfDownloadName?: string;
}

export const CvDocument: React.FC<CvDocumentProps> = ({
  initialTheme,
  cvData = defaultCvData,
  className = "",
  pdfUrl = "/cv.pdf",
  pdfDownloadName = "CV-Antoine-Grea.pdf",
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const containerClasses = [
    styles.container,
    initialTheme ? styles[`theme-${initialTheme}`] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      data-theme={initialTheme}
      data-hydrated={isHydrated}
      data-testid="cv-document"
    >
      <aside className={styles.fabContainer} aria-label="Téléchargement du CV">
        <FloatingActionButton
          tooltip="Télécharger le CV (PDF)"
          href={pdfUrl}
          download={pdfDownloadName}
          target="_blank"
          testId="fab-pdf"
          icon={<PictureAsPdfRoundedIcon sx={{ fontSize: 28 }} />}
        />
      </aside>

      <main className={styles.fluidContainer} data-testid="cv-fluid-view">
        <section className={styles.fluidCard} aria-label="Profil et Parcours">
          <div
            className={styles.fluidContent}
            dangerouslySetInnerHTML={{ __html: cvData.p1Html }}
          />
        </section>

        <section
          className={styles.fluidCard}
          aria-label="Thèse et Publications"
        >
          <div
            className={styles.fluidContent}
            dangerouslySetInnerHTML={{ __html: cvData.p2Html }}
          />
        </section>
      </main>
    </div>
  );
};
