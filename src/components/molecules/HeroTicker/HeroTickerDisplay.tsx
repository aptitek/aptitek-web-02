import type { FC, ElementType } from "react";
import Box from "@mui/material/Box";
import type {
  HeroTickerSize,
  HeroTickerAnimationMode,
  SolarizedAccent,
  FlourishStyle,
} from "./HeroTicker.types";
import {
  HeroTitleRoot,
  PrefixSpan,
  SuffixSpan,
  TickerWrapper,
  MilkshakeCursiveText,
} from "./HeroTicker.styles";
import { HeroTickerNib } from "./HeroTickerNib";
import { HeroTickerFlourish } from "./HeroTickerFlourish";

export interface HeroTickerDisplayProps {
  as: ElementType;
  size: HeroTickerSize;
  align: "center" | "left" | "right";
  prefix: string;
  suffix: string;
  visibleText: string;
  fullSloganText: string;
  currentPhrase?: string;
  accentColor: SolarizedAccent;
  accentVar: string;
  animationMode: HeroTickerAnimationMode;
  drawProgress: number;
  currentProgress: number;
  fadeOpacity: number;
  isDrawing: boolean;
  showNib: boolean;
  flourish: FlourishStyle;
}

export const HeroTickerDisplay: FC<HeroTickerDisplayProps> = ({
  as: Component,
  size,
  align,
  prefix,
  suffix,
  visibleText,
  fullSloganText,
  currentPhrase,
  accentColor,
  accentVar,
  animationMode,
  drawProgress,
  currentProgress,
  fadeOpacity,
  isDrawing,
  showNib,
  flourish,
}) => {
  const isCursiveDraw = animationMode === "cursive-draw";
  const isFade = animationMode === "fade";
  const clipProg = isCursiveDraw ? drawProgress : 100;
  const isNibVisible = showNib && !isFade && currentProgress > 0;

  return (
    <HeroTitleRoot component={Component} $size={size} $align={align}>
      {/* Screen-reader-only live announcement for accessible heading outline */}
      <Box
        component="span"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {fullSloganText}
      </Box>

      {/* Visual animated presentation hidden from screen readers to prevent fragmented speech */}
      <Box component="span" sx={{ display: "contents" }} aria-hidden="true">
        {prefix && (
          <PrefixSpan data-testid="hero-ticker-prefix">{prefix}</PrefixSpan>
        )}

        <TickerWrapper data-testid="hero-ticker-word-wrapper">
          <MilkshakeCursiveText
            data-testid="hero-ticker-cursive-text"
            $accent={accentColor}
            $clipProgress={clipProg}
            $isDrawing={isCursiveDraw}
            $fadeOpacity={isFade ? fadeOpacity : 1}
          >
            {visibleText}
          </MilkshakeCursiveText>

          <HeroTickerNib
            progress={currentProgress}
            phrase={currentPhrase || visibleText}
            active={isDrawing}
            visible={isNibVisible}
            colorVar={accentVar}
          />

          <HeroTickerFlourish
            flourishStyle={flourish}
            colorVar={accentVar}
            progress={currentProgress}
            visible={true}
          />
        </TickerWrapper>

        {suffix && (
          <SuffixSpan data-testid="hero-ticker-suffix">{suffix}</SuffixSpan>
        )}
      </Box>
    </HeroTitleRoot>
  );
};
