import React from "react";
import Button from "@mui/material/Button";
import styles from "./CvActionButton.module.css";

export interface CvActionButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "accent";
  onClick?: () => void;
  href?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  className?: string;
  title?: string;
}

export const CvActionButton: React.FC<CvActionButtonProps> = ({
  children,
  icon,
  variant = "secondary",
  onClick,
  href,
  download,
  target,
  rel,
  ariaLabel,
  className = "",
  title,
}) => {
  const combinedClassName =
    `${styles.btn} ${styles[variant]} ${className}`.trim();
  const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return (
    <Button
      component={href ? "a" : "button"}
      href={href}
      download={download}
      target={target}
      rel={safeRel}
      className={combinedClassName}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </Button>
  );
};
