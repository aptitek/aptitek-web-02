import type React from "react";
import type { ReactNode } from "react";

export interface FloatingActionButtonProps {
  tooltip: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  className?: string;
  testId?: string;
  icon?: ReactNode;
  href?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
}
