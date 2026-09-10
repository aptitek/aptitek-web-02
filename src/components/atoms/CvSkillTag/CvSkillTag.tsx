import React from "react";
import Button from "@mui/material/Button";
import styles from "./CvSkillTag.module.css";

export interface CvSkillTagProps {
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
  isActive?: boolean;
  count?: number;
  onClick?: (id: string) => void;
}

export const CvSkillTag: React.FC<CvSkillTagProps> = ({
  id,
  label,
  color = "blue",
  isActive = false,
  count,
  onClick,
}) => {
  const handleClick = () => {
    onClick?.(id);
  };

  const colorClass = styles[`color-${color}`] || "";
  const activeClass = isActive ? styles.active : "";
  const buttonClassName = [styles.tag, colorClass, activeClass]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      variant="outlined"
      className={buttonClassName}
      onClick={handleClick}
      aria-pressed={isActive}
      data-testid={`skill-tag-${id}`}
      sx={{
        textTransform: "none",
        minWidth: "auto",
      }}
    >
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
      {typeof count === "number" && (
        <span className={styles.count}>{count}</span>
      )}
    </Button>
  );
};
