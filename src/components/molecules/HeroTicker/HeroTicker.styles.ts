import type { ElementType } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  FONT_FAMILIES,
  RECURSIVE_PRESETS,
  M3_TYPESCALE,
} from "~/tokens/typography";
import type { HeroTickerSize, SolarizedAccent } from "./HeroTicker.types";

export const SOLARIZED_ACCENT_VARS: Record<
  SolarizedAccent,
  { main: string; glow: string }
> = {
  cyan: {
    main: "var(--color-solarized-cyan)",
    glow: "var(--color-solarized-cyan)",
  },
  blue: {
    main: "var(--color-solarized-blue)",
    glow: "var(--color-solarized-blue)",
  },
  magenta: {
    main: "var(--color-solarized-magenta)",
    glow: "var(--color-solarized-magenta)",
  },
  yellow: {
    main: "var(--color-solarized-yellow)",
    glow: "var(--color-solarized-yellow)",
  },
  orange: {
    main: "var(--color-solarized-orange)",
    glow: "var(--color-solarized-orange)",
  },
  violet: {
    main: "var(--color-solarized-violet)",
    glow: "var(--color-solarized-violet)",
  },
  green: {
    main: "var(--color-solarized-green)",
    glow: "var(--color-solarized-green)",
  },
};

const filterTickerProp = (prop: PropertyKey) =>
  prop !== "$size" &&
  prop !== "$align" &&
  prop !== "$accent" &&
  prop !== "$clipProgress" &&
  prop !== "$isDrawing" &&
  prop !== "$fadeOpacity";

export const HeroTitleRoot = styled(Box, {
  shouldForwardProp: filterTickerProp,
})<{
  $size: HeroTickerSize;
  $align: "center" | "left" | "right";
  component?: ElementType;
}>(({ theme, $size, $align }) => {
  const sizeConfig =
    $size === "large"
      ? {
          fontSize: M3_TYPESCALE.displayLarge.fontSize,
          lineHeight: M3_TYPESCALE.displayLarge.lineHeight,
        }
      : $size === "medium"
        ? {
            fontSize: M3_TYPESCALE.displayMedium.fontSize,
            lineHeight: M3_TYPESCALE.displayMedium.lineHeight,
          }
        : {
            fontSize: M3_TYPESCALE.displaySmall.fontSize,
            lineHeight: M3_TYPESCALE.displaySmall.lineHeight,
          };

  const justifyMap = {
    center: "center",
    left: "flex-start",
    right: "flex-end",
  };

  return {
    margin: 0,
    padding: theme.spacing(1, 0),
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: justifyMap[$align],
    textAlign: $align,
    gap: "0.22em",
    fontSize: sizeConfig.fontSize,
    lineHeight: sizeConfig.lineHeight,
    color: theme.palette.text.primary,
    userSelect: "none",
    // Responsive scale down on tablet and mobile viewports
    [theme.breakpoints.down("md")]: {
      fontSize: M3_TYPESCALE.displaySmall.fontSize,
      lineHeight: M3_TYPESCALE.displaySmall.lineHeight,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: M3_TYPESCALE.headlineLarge.fontSize,
      lineHeight: M3_TYPESCALE.headlineLarge.lineHeight,
    },
  };
});

export const PrefixSpan = styled("span")(({ theme }) => ({
  fontFamily: FONT_FAMILIES.brand,
  fontVariationSettings: RECURSIVE_PRESETS.casualSlantedBold,
  fontStyle: "italic",
  fontWeight: 700,
  letterSpacing: "-0.015em",
  color: theme.palette.text.primary,
  display: "inline",
  whiteSpace: "pre-wrap",
}));

export const SuffixSpan = styled("span")(({ theme }) => ({
  fontFamily: FONT_FAMILIES.brand,
  fontVariationSettings: RECURSIVE_PRESETS.casualSlantedBold,
  fontStyle: "italic",
  fontWeight: 700,
  letterSpacing: "-0.015em",
  color: theme.palette.text.primary,
  display: "inline",
  whiteSpace: "pre-wrap",
}));

export const TickerWrapper = styled("span")(() => ({
  display: "inline-flex",
  position: "relative",
  alignItems: "baseline",
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
}));

export const MilkshakeCursiveText = styled("span", {
  shouldForwardProp: filterTickerProp,
})<{
  $accent: SolarizedAccent;
  $clipProgress?: number;
  $isDrawing?: boolean;
  $fadeOpacity?: number;
}>(({ $accent, $clipProgress = 100, $isDrawing = false, $fadeOpacity = 1 }) => {
  const accentVars = SOLARIZED_ACCENT_VARS[$accent];
  const progress = Math.max(0, Math.min(100, $clipProgress));

  return {
    fontFamily: FONT_FAMILIES.logo,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "1.15em",
    lineHeight: 1.05,
    display: "inline-block",
    whiteSpace: "nowrap",
    color: accentVars.main,
    filter: `drop-shadow(0 0 14px ${accentVars.glow})`,
    opacity: $fadeOpacity,
    // In cursive-draw mode, clip horizontally with angled slant matching cursive slope
    clipPath: $isDrawing
      ? `polygon(0 0, calc(${progress}% + 14px) 0, ${progress}% 100%, 0 100%)`
      : "none",
    transition: $isDrawing ? "none" : "opacity 180ms ease-out",
    transform: "translateZ(0)",
  };
});

export const ControlsBar = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 20,
  backgroundColor: theme.palette.surfaceContainer,
  backdropFilter: "blur(12px)",
  border: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(2),
}));

export const DotIndicator = styled("span", {
  shouldForwardProp: (prop) => prop !== "$active" && prop !== "$accent",
})<{ $active: boolean; $accent: SolarizedAccent }>(({
  theme,
  $active,
  $accent,
}) => {
  const accentVars = SOLARIZED_ACCENT_VARS[$accent];
  return {
    display: "inline-block",
    position: "relative",
    width: $active ? 20 : 8,
    height: 8,
    borderRadius: 4,
    border: "none",
    padding: 0,
    cursor: "pointer",
    backgroundColor: $active ? accentVars.main : theme.palette.text.secondary,
    boxShadow: $active ? `0 0 8px ${accentVars.glow}` : "none",
    transition: theme.transitions.create(["width", "background-color"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      backgroundColor: accentVars.main,
    },
    // Expanded hit area (WCAG 2.5.8 Target Size Minimum >= 24x24px)
    "&::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      minWidth: 24,
      minHeight: 24,
    },
    "&:focus-visible": {
      outline: `2px solid ${accentVars.main}`,
      outlineOffset: 3,
    },
  };
});
