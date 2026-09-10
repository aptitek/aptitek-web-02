import React, { useState } from "react";
import Button from "@mui/material/Button";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { CvSkillTag } from "~/components/atoms/CvSkillTag/CvSkillTag";
import { CvActionButton } from "~/components/atoms/CvActionButton/CvActionButton";
import styles from "./CvToolbar.module.css";

export interface SkillItem {
  id: string;
  label: string;
  color?:
    | "yellow"
    | "orange"
    | "red"
    | "magenta"
    | "violet"
    | "blue"
    | "cyan"
    | "green";
  count?: number;
}

export interface CvToolbarProps {
  themeMode: "light" | "dark";
  onThemeModeChange: (theme: "light" | "dark") => void;
  skills: SkillItem[];
  selectedSkill: string | null;
  onSelectSkill: (skillId: string | null) => void;
  pdfUrl?: string;
  email?: string;
  phone?: string;
}

export const CvToolbar: React.FC<CvToolbarProps> = ({
  themeMode,
  onThemeModeChange,
  skills,
  selectedSkill,
  onSelectSkill,
  pdfUrl = "/cv.pdf",
  email = "antoine@aptitek.io",
  phone = "+33 7 66 77 21 26",
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copié dans le presse-papier !");
    } catch {
      showToast(email);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      showToast("Téléphone copié dans le presse-papier !");
    } catch {
      showToast(phone);
    }
  };

  return (
    <aside className={styles.toolbarContainer} aria-label="Commandes du CV">
      {/* Toast feedback */}
      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          <CheckRoundedIcon sx={{ fontSize: "1.1rem" }} /> {toastMessage}
        </div>
      )}

      {/* Row 1: Primary Controls */}
      <div className={styles.topRow}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>Thème :</span>
          <div className={styles.segmentedControl} role="tablist">
            <Button
              role="tab"
              aria-selected={themeMode === "light"}
              className={`${styles.segmentBtn} ${themeMode === "light" ? styles.activeSegment : ""}`}
              onClick={() => onThemeModeChange("light")}
              title="Solarized Papier Clair"
            >
              <LightModeRoundedIcon sx={{ fontSize: "1.1rem" }} /> Clair
            </Button>
            <Button
              role="tab"
              aria-selected={themeMode === "dark"}
              className={`${styles.segmentBtn} ${themeMode === "dark" ? styles.activeSegment : ""}`}
              onClick={() => onThemeModeChange("dark")}
              title="Solarized Écran Sombre"
            >
              <DarkModeRoundedIcon sx={{ fontSize: "1.1rem" }} /> Sombre
            </Button>
          </div>
        </div>

        <div className={styles.actions}>
          <CvActionButton
            variant="accent"
            icon={<PictureAsPdfRoundedIcon sx={{ fontSize: "1.15rem" }} />}
            href={pdfUrl}
            download="CV-Antoine-Grea.pdf"
            target="_blank"
            title="Télécharger le document PDF"
          >
            Télécharger PDF
          </CvActionButton>

          <CvActionButton
            variant="ghost"
            icon={<EmailRoundedIcon sx={{ fontSize: "1.15rem" }} />}
            onClick={handleCopyEmail}
            title="Copier l'adresse email"
          >
            Copier Email
          </CvActionButton>

          <CvActionButton
            variant="ghost"
            icon={<PhoneRoundedIcon sx={{ fontSize: "1.15rem" }} />}
            onClick={handleCopyPhone}
            title="Copier le numéro de téléphone"
          >
            Copier Tel
          </CvActionButton>
        </div>
      </div>

      {/* Row 2: Skill Filter Matrix */}
      <div className={styles.filterRow}>
        <div className={styles.filterHeader}>
          <span className={styles.filterTitle}>Filtrer par compétences :</span>
          {selectedSkill && (
            <Button
              className={styles.resetBtn}
              onClick={() => onSelectSkill(null)}
            >
              <CloseRoundedIcon sx={{ fontSize: "0.95rem" }} /> Réinitialiser le
              filtre
            </Button>
          )}
        </div>

        <div className={styles.tagsGrid}>
          {skills.map((skill) => (
            <CvSkillTag
              key={skill.id}
              id={skill.id}
              label={skill.label}
              color={skill.color}
              isActive={selectedSkill === skill.id}
              count={skill.count}
              onClick={(id) => onSelectSkill(selectedSkill === id ? null : id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
