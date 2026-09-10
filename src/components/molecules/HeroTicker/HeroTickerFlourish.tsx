import type { FC, ReactElement } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { M3_STROKES } from "~/tokens/spacing";
import type { FlourishStyle } from "./HeroTicker.types";

const FlourishCanvas = styled("svg")({
  width: "108%",
  height: "100%",
  overflow: "visible",
  display: "block",
});

const FlourishVectorPath = styled("path")<{ $dashOffset: number }>(
  ({ $dashOffset }) => ({
    strokeDasharray: 200,
    strokeDashoffset: $dashOffset,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    transition: "stroke-dashoffset 220ms ease-out",
  }),
);

const FlourishVectorLine = styled("line")<{ $dashOffset: number }>(
  ({ $dashOffset }) => ({
    strokeDasharray: 200,
    strokeDashoffset: $dashOffset,
    strokeLinecap: "round",
    transition: "stroke-dashoffset 220ms ease-out",
  }),
);

function renderFlourishShape(
  style: FlourishStyle,
  dashOffset: number,
): ReactElement | null {
  if (style === "swoosh") {
    return (
      <FlourishVectorPath
        d="M 2 12 C 45 4, 130 3, 196 9 C 160 14, 80 13, 22 15"
        stroke="url(#flourishGlowGrad)"
        strokeWidth={M3_STROKES.medium}
        $dashOffset={dashOffset}
      />
    );
  }
  if (style === "wave") {
    return (
      <FlourishVectorPath
        d="M 2 8 Q 35 15 70 8 T 140 8 T 198 8"
        stroke="url(#flourishGlowGrad)"
        strokeWidth={M3_STROKES.medium}
        $dashOffset={dashOffset}
      />
    );
  }
  if (style === "glow-line") {
    return (
      <FlourishVectorLine
        x1="2"
        y1="8"
        x2="198"
        y2="8"
        stroke="url(#flourishGlowGrad)"
        strokeWidth={M3_STROKES.medium}
        $dashOffset={dashOffset}
      />
    );
  }
  return null;
}

export interface HeroTickerFlourishProps {
  flourishStyle?: FlourishStyle;
  colorVar?: string;
  progress?: number;
  visible?: boolean;
  "data-testid"?: string;
}

export const HeroTickerFlourish: FC<HeroTickerFlourishProps> = ({
  flourishStyle = "swoosh",
  colorVar = "var(--color-solarized-cyan)",
  progress = 100,
  visible = true,
  "data-testid": testId = "hero-ticker-flourish",
}) => {
  if (!visible || flourishStyle === "none") return null;

  const strokeProgress = Math.max(0, Math.min(100, progress));
  const dashOffset = 200 - (strokeProgress / 100) * 200;

  return (
    <Box
      data-testid={testId}
      aria-hidden="true"
      sx={{
        position: "absolute",
        left: "-4%",
        right: "-4%",
        bottom: "-12px",
        height: "16px",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "visible",
      }}
    >
      <FlourishCanvas
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient
            id="flourishGlowGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={colorVar} stopOpacity="0.1" />
            <stop offset="40%" stopColor={colorVar} stopOpacity="0.9" />
            <stop offset="85%" stopColor={colorVar} stopOpacity="1" />
            <stop offset="100%" stopColor={colorVar} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {renderFlourishShape(flourishStyle, dashOffset)}
      </FlourishCanvas>
    </Box>
  );
};
