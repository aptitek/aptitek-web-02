import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

export type SolarizedThemeMode = "light" | "sunset" | "dark" | "auto";

export interface SolarizedBackgroundProps {
  /**
   * Visual theme mode: 'light' / 'sunset' (Golden hour with pink sunset gradient & yellow sun),
   * 'dark' (Crescent Night with Aurora), or 'auto' (reads from ThemeRegistry/CSS).
   * Defaults to 'auto'.
   */
  mode?: SolarizedThemeMode;

  /**
   * Whether mouse cursor movement dynamically influences the breeze vector and subtle parallax.
   * Defaults to true.
   */
  interactive?: boolean;

  /**
   * Whether to display the peaceful vector tree anchored on the left landscape.
   * Defaults to true.
   */
  showTree?: boolean;

  /**
   * Whether to display the layered rolling hills in the background.
   * Defaults to true.
   */
  showHills?: boolean;

  /**
   * Whether to display the celestial body (Sun with pulsating corona in light mode, Crescent Moon with starfield in dark mode).
   * Defaults to true.
   */
  showCelestial?: boolean;

  /**
   * Whether to display soft drifting rounded cloud layers.
   * Defaults to true.
   */
  showClouds?: boolean;

  /**
   * Whether to display radiant crepuscular sunbeams (godrays) in day/sunset mode.
   * Defaults to true.
   */
  showGodrays?: boolean;

  /**
   * Whether to display the luminous undulating northern lights (aurora borealis) in dark mode.
   * Defaults to true.
   */
  showAurora?: boolean;

  /**
   * Whether to display foreground grass blades styled with base2 / base02 for smooth page background transitions.
   * Defaults to true.
   */
  showGrass?: boolean;

  /**
   * Number of drifting leaves simulated simultaneously.
   * Defaults to 44.
   */
  leafCount?: number;

  /**
   * Multiplier applied to ambient breeze velocity.
   * Defaults to 1.0.
   */
  windIntensity?: number;

  /**
   * Foreground content rendered over the peaceful background.
   */
  children?: ReactNode;

  /**
   * Custom CSS class name for the root container.
   */
  className?: string;

  /**
   * MUI SX styling system overrides.
   */
  sx?: SxProps<Theme>;
}

export interface LeafColors {
  readonly vein: string;
  readonly leftTop: string;
  readonly leftMid: string;
  readonly leftBottom: string;
  readonly rightTop: string;
  readonly rightMid: string;
  readonly rightBottom: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speedX: number;
  speedY: number;
}

export interface WindState {
  baseSpeedX: number;
  baseSpeedY: number;
  currentX: number;
  currentY: number;
  gustBoost: number;
}
