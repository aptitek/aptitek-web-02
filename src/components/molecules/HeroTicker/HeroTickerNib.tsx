import type { FC } from "react";
import Box from "@mui/material/Box";
import { calculateQuillTrajectory } from "./quillTrajectory";

export interface HeroTickerNibProps {
  progress: number;
  phrase?: string;
  active?: boolean;
  visible?: boolean;
  colorVar?: string;
  "data-testid"?: string;
}

const InkDroplet: FC<{ colorVar: string; isDownstroke?: boolean }> = ({
  colorVar,
  isDownstroke = false,
}) => (
  <Box
    sx={{
      position: "absolute",
      left: "10px",
      bottom: "2px",
      width: isDownstroke ? 8 : 6,
      height: isDownstroke ? 8 : 6,
      borderRadius: "50%",
      backgroundColor: colorVar,
      boxShadow: isDownstroke
        ? `0 0 12px 3px ${colorVar}`
        : `0 0 8px 2px ${colorVar}`,
      opacity: isDownstroke ? 0.95 : 0.75,
      pointerEvents: "none",
      transform: "translate(-50%, 50%)",
      transition:
        "width 90ms ease-out, height 90ms ease-out, opacity 90ms ease-out",
    }}
  />
);

export const HeroTickerNib: FC<HeroTickerNibProps> = (props) => {
  const visible = props.visible ?? true;
  if (!visible) return null;

  const progress = props.progress;
  const active = props.active ?? true;
  const colorVar = props.colorVar || "var(--color-solarized-cyan)";
  const phrase = props.phrase || "";
  const testId = props["data-testid"] || "hero-ticker-nib";

  const trajectory = calculateQuillTrajectory(phrase, progress, active);

  return (
    <Box
      data-testid={testId}
      aria-hidden="true"
      sx={{
        position: "absolute",
        // Position quill tip (x: 21.7%, y: 95.8%) dynamically along cursive letter strokes
        left: trajectory.left,
        bottom: trajectory.bottom,
        pointerEvents: "none",
        zIndex: 3,
        transition: active
          ? "transform 90ms ease-out"
          : "left 200ms ease-out, bottom 200ms ease-out, transform 300ms ease-out",
        opacity: 1,
        transform: `rotate(${trajectory.tiltAngle}deg)`,
        transformOrigin: "21.7% 95.8%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))",
      }}
    >
      {/* AptiTek Cyber Quill from public/quill.svg */}
      <Box
        component="img"
        src="/quill.svg"
        alt=""
        sx={{
          width: 52,
          height: 52,
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Dynamic Luminous Wet Ink Sparkle at the Quill Tip */}
      {active && (
        <InkDroplet
          colorVar={colorVar}
          isDownstroke={trajectory.isDownstroke}
        />
      )}
    </Box>
  );
};

export const HeroTickerQuill = HeroTickerNib;
export default HeroTickerNib;
