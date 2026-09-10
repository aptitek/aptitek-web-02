import type { ElementType } from "react";
import { styled } from "@mui/material/styles";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";

export interface StyledFloatingActionButtonProps extends IconButtonProps {
  component?: ElementType;
  href?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
}

export const StyledFloatingActionButton = styled(
  IconButton,
)<StyledFloatingActionButtonProps>(({ theme }) => {
  const primary = theme.palette.primary.main;
  const contrast = theme.palette.primary.contrastText;

  return {
    width: 48,
    height: 48,
    borderRadius: "16px",
    backgroundColor: primary,
    color: contrast,
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(
      ["transform", "box-shadow", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "&:hover": {
      backgroundColor: theme.palette.primary.dark || primary,
      transform: "scale(1.1)",
      boxShadow: theme.shadows[4],
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  };
});

export const MD3FloatingActionButton = StyledFloatingActionButton;
