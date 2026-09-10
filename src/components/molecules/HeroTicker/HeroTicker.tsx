import { useState, type FC, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import "~/i18n";
import Box from "@mui/material/Box";
import type { HeroTickerProps } from "./HeroTicker.types";
import { SOLARIZED_ACCENT_VARS } from "./HeroTicker.styles";
import { HeroTickerControls } from "./HeroTickerControls";
import { HeroTickerDisplay } from "./HeroTickerDisplay";
import {
  usePrefersReducedMotion,
  useTickerState,
  useDrawAnimation,
  useTypeAnimation,
  useFadeAnimation,
  useVisibleText,
  calculateCurrentProgress,
} from "./useHeroTickerAnimation";

const DEFAULT_PHRASES: string[] = [
  "revolutionary ideas",
  "limitless experiences",
  "sustainable futures",
  "artistic intelligence",
  "elegant software",
];

const DEFAULT_CONFIG: Required<
  Omit<
    HeroTickerProps,
    "className" | "style" | "onPhraseChange" | "data-testid"
  >
> = {
  prefix: "We craft ",
  phrases: DEFAULT_PHRASES,
  suffix: " that inspire.",
  animationMode: "cursive-draw",
  accentColor: "magenta",
  flourish: "swoosh",
  as: "h1",
  size: "large",
  drawSpeed: 1200,
  typeSpeed: 75,
  eraseSpeed: 35,
  pauseDuration: 2400,
  pauseOnHover: true,
  pauseOnFocus: true,
  showControls: false,
  showNib: true,
  showQuill: true,
  align: "center",
};

function getI18nDefaults(t: TFunction) {
  const i18nPhrases = t("heroTicker.phrases", { returnObjects: true });
  const phrases =
    Array.isArray(i18nPhrases) && i18nPhrases.length > 0
      ? (i18nPhrases as string[])
      : DEFAULT_PHRASES;
  return {
    phrases,
    prefix: String(t("heroTicker.prefix", "We craft ")),
    suffix: String(t("heroTicker.suffix", " that inspire.")),
  };
}

function computeIsPaused(params: {
  isPausedManually: boolean;
  pauseOnHover: boolean;
  isHovered: boolean;
  pauseOnFocus: boolean;
  isFocused: boolean;
}): boolean {
  if (params.isPausedManually) return true;
  if (params.pauseOnHover && params.isHovered) return true;
  if (params.pauseOnFocus && params.isFocused) return true;
  return false;
}

function getResolvedConfig(
  props: HeroTickerProps,
  defaultPrefix: string,
  defaultSuffix: string,
  defaultPhrases: string[],
) {
  const merged = Object.assign(
    {},
    DEFAULT_CONFIG,
    {
      prefix: defaultPrefix,
      suffix: defaultSuffix,
      phrases: defaultPhrases,
    },
    props,
  );
  if (!merged.phrases || merged.phrases.length === 0) {
    merged.phrases = defaultPhrases;
  }
  if (props.showQuill !== undefined) {
    merged.showNib = props.showQuill;
  }
  return merged;
}

const ALIGN_FLEX_MAP = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
} as const;

export const HeroTicker: FC<HeroTickerProps> = (props): ReactElement => {
  const { t } = useTranslation("common");
  const i18nDefaults = getI18nDefaults(t);

  const config = getResolvedConfig(
    props,
    i18nDefaults.prefix,
    i18nDefaults.suffix,
    i18nDefaults.phrases,
  );
  const state = useTickerState(config.phrases, props.onPhraseChange);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isFocused, setIsFocused] = useState(false);

  const isPaused = computeIsPaused({
    isPausedManually: state.isPausedManually,
    pauseOnHover: config.pauseOnHover,
    isHovered: state.isHovered,
    pauseOnFocus: config.pauseOnFocus,
    isFocused,
  });
  const currentPhrase = config.phrases[state.currentIndex] || "";
  const accentVars = SOLARIZED_ACCENT_VARS[config.accentColor];
  const isDraw =
    config.animationMode === "cursive-draw" && !prefersReducedMotion;
  const isType =
    config.animationMode === "cursive-type" && !prefersReducedMotion;
  const isFade = config.animationMode === "fade" && !prefersReducedMotion;

  const drawProgress = useDrawAnimation({
    enabled: isDraw,
    phase: state.phase,
    drawSpeed: config.drawSpeed,
    pauseDuration: config.pauseDuration,
    isPaused,
    onDrawComplete: state.onDrawComplete,
    onPauseComplete: state.onPauseComplete,
    onEraseComplete: state.goToNext,
  });

  const typeCharsCount = useTypeAnimation({
    enabled: isType,
    phase: state.phase,
    phraseLength: currentPhrase.length,
    typeSpeed: config.typeSpeed,
    eraseSpeed: config.eraseSpeed,
    pauseDuration: config.pauseDuration,
    isPaused,
    onTypeComplete: state.onDrawComplete,
    onPauseComplete: state.onPauseComplete,
    onEraseComplete: state.goToNext,
  });

  const fadeOpacity = useFadeAnimation({
    enabled: isFade,
    phase: state.phase,
    pauseDuration: config.pauseDuration,
    isPaused,
    onFadeInComplete: state.onDrawComplete,
    onPauseComplete: state.onPauseComplete,
    onFadeOutComplete: state.goToNext,
  });

  const visibleText = useVisibleText(
    config.animationMode,
    currentPhrase,
    typeCharsCount,
    prefersReducedMotion,
  );

  const currentProgress = calculateCurrentProgress(
    config.animationMode,
    drawProgress,
    typeCharsCount,
    currentPhrase.length,
  );

  const fullSloganSentence = `${config.prefix}${currentPhrase}${config.suffix}`;
  const testId = props["data-testid"] || "hero-ticker";

  return (
    <Box
      data-testid={testId}
      className={props.className}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: ALIGN_FLEX_MAP[config.align],
        width: "100%",
      }}
      onMouseEnter={() => state.setIsHovered(true)}
      onMouseLeave={() => state.setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      <HeroTickerDisplay
        as={config.as}
        size={config.size}
        align={config.align}
        prefix={config.prefix}
        suffix={config.suffix}
        visibleText={visibleText}
        fullSloganText={fullSloganSentence}
        currentPhrase={currentPhrase}
        accentColor={config.accentColor}
        accentVar={accentVars.main}
        animationMode={config.animationMode}
        drawProgress={drawProgress}
        currentProgress={currentProgress}
        fadeOpacity={fadeOpacity}
        isDrawing={state.phase === "drawing"}
        showNib={config.showNib}
        flourish={config.flourish}
      />

      {config.showControls && (
        <HeroTickerControls
          phrases={config.phrases}
          currentIndex={state.currentIndex}
          isPaused={state.isPausedManually}
          accentColor={config.accentColor}
          accentVar={accentVars.main}
          onPrev={state.goToPrev}
          onNext={state.goToNext}
          onTogglePause={() => state.setIsPausedManually((prev) => !prev)}
          onSelectIndex={state.goToIndex}
        />
      )}
    </Box>
  );
};

export default HeroTicker;
