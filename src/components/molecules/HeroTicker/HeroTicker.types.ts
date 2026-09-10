import type { CSSProperties, ElementType } from "react";

export type HeroTickerSize = "small" | "medium" | "large";

export type HeroTickerAnimationMode = "cursive-draw" | "cursive-type" | "fade";

export type SolarizedAccent =
  "cyan" | "magenta" | "blue" | "yellow" | "orange" | "violet" | "green";

export type FlourishStyle = "swoosh" | "wave" | "glow-line" | "none";

export interface HeroTickerProps {
  /**
   * Slogan prefix rendered in Recursive Casual Italic.
   * @default "We craft "
   */
  prefix?: string;

  /**
   * List of phrases to cycle through, rendered in Milkshake cursive font.
   */
  phrases?: string[];

  /**
   * Slogan suffix rendered in Recursive Casual Italic.
   * @default " that inspire."
   */
  suffix?: string;

  /**
   * Animation rendering mode.
   * - "cursive-draw": Smooth continuous calligraphy ink-reveal with moving nib.
   * - "cursive-type": Humanized character-by-character handwriting cadence with ink bloom.
   * - "fade": Kinetic typography slide-fade for minimal/reduced-motion needs.
   * @default "cursive-draw"
   */
  animationMode?: HeroTickerAnimationMode;

  /**
   * Solarized accent color for the Milkshake cursive text and flourishes.
   * @default "cyan"
   */
  accentColor?: SolarizedAccent;

  /**
   * Calligraphic underline flourish style.
   * @default "swoosh"
   */
  flourish?: FlourishStyle;

  /**
   * Semantic HTML element tag.
   * @default "h1"
   */
  as?: ElementType;

  /**
   * Display size tier mapped to Material 3 Type Scale tokens.
   * @default "large"
   */
  size?: HeroTickerSize;

  /**
   * Duration in ms to reveal the cursive text in "cursive-draw" mode.
   * @default 1200
   */
  drawSpeed?: number;

  /**
   * Speed in ms per character in "cursive-type" mode.
   * @default 75
   */
  typeSpeed?: number;

  /**
   * Speed in ms per character when erasing.
   * @default 35
   */
  eraseSpeed?: number;

  /**
   * Duration in ms to hold the phrase when fully revealed.
   * @default 2400
   */
  pauseDuration?: number;

  /**
   * Pause the ticker when hovered with mouse pointer.
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Pause the ticker when keyboard focus enters interactive elements (WCAG 2.2.2).
   * @default true
   */
  pauseOnFocus?: boolean;

  /**
   * Show interactive playback controls and phrase progress indicators.
   * @default false
   */
  showControls?: boolean;

  /**
   * Display the cyber quill icon from quill.svg at the leading edge while drawing.
   * @default true
   */
  showQuill?: boolean;

  /**
   * Alias for showQuill.
   * @default true
   */
  showNib?: boolean;

  /**
   * Horizontal text alignment.
   * @default "center"
   */
  align?: "center" | "left" | "right";

  /**
   * Callback fired whenever the ticker advances to a new phrase.
   */
  onPhraseChange?: (index: number, phrase: string) => void;

  /**
   * Custom CSS class name.
   */
  className?: string;

  /**
   * Custom inline styles.
   */
  style?: CSSProperties;

  /**
   * Test identifier.
   */
  "data-testid"?: string;
}
