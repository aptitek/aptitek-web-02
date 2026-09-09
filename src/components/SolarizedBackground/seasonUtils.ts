import {
  BOTANICAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
} from "~/tokens/theme";
import type { LeafColors, SolarizedSeason } from "./SolarizedBackground.types";

export interface SeasonTransitionState {
  fromIndex: number; // 0=Spring, 1=Summer, 2=Fall, 3=Winter
  toIndex: number;
  blendFactor: number; // 0..1
}

export interface SeasonalCanopyTokens {
  trunkPrimary: string;
  trunkSecondary: string;
  foliage1A: string;
  foliage1B: string;
  foliage2A: string;
  foliage2B: string;
  foliageWarmA: string;
  foliageWarmB: string;
  blossomOpacity: number; // 0..1 (spring cherry blossoms)
  snowOpacity: number; // 0..1 (winter snowdrifts)
}

export interface SeasonalHillTokens {
  hillBack: string;
  hillMid: string;
  hillFront: string;
}

export interface SeasonalGrassTokens {
  primaryStart: string;
  primaryMid: string;
  primaryEnd: string;
  secondaryStart: string;
  secondaryEnd: string;
}

export function resolveSeasonProgress(
  season?: SolarizedSeason,
  seasonProgress?: number,
): number {
  if (typeof seasonProgress === "number" && !Number.isNaN(seasonProgress)) {
    return ((seasonProgress % 4) + 4) % 4;
  }

  if (season === "spring") return 0.0;
  if (season === "fall" || season === "autumn") return 2.0;
  if (season === "winter") return 3.0;

  return 1.0; // Default: summer
}

export function getSeasonTransitionState(
  progress: number,
): SeasonTransitionState {
  const normalized = ((progress % 4) + 4) % 4;
  const fromIndex = Math.floor(normalized);
  const toIndex = (fromIndex + 1) % 4;
  const blendFactor = normalized - fromIndex;

  return { fromIndex, toIndex, blendFactor };
}

export function interpolateHex(hexA: string, hexB: string, t: number): string {
  const cleanA = hexA.replace("#", "");
  const cleanB = hexB.replace("#", "");

  const r1 = parseInt(cleanA.substring(0, 2), 16) || 0;
  const g1 = parseInt(cleanA.substring(2, 4), 16) || 0;
  const b1 = parseInt(cleanA.substring(4, 6), 16) || 0;

  const r2 = parseInt(cleanB.substring(0, 2), 16) || 0;
  const g2 = parseInt(cleanB.substring(2, 4), 16) || 0;
  const b2 = parseInt(cleanB.substring(4, 6), 16) || 0;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const CANOPY_SEASON_PALETTES = [
  // 0: Spring (Cherry blossom pinks)
  {
    foliage1A: SEASON_COLORS.spring.canopyA,
    foliage1B: SEASON_COLORS.spring.canopyB,
    foliage2A: SEASON_COLORS.spring.blossomDeep,
    foliage2B: SEASON_COLORS.spring.blossom,
    foliageWarmA: SEASON_COLORS.spring.canopyWarm,
    foliageWarmB: SEASON_COLORS.spring.blossomPetal,
  },
  // 1: Summer (Lush emerald and warm sunlit botanical greens)
  {
    foliage1A: SEASON_COLORS.summer.canopyA,
    foliage1B: SEASON_COLORS.summer.canopyB,
    foliage2A: SEASON_COLORS.summer.deepCanopyA,
    foliage2B: SEASON_COLORS.summer.deepCanopyB,
    foliageWarmA: SEASON_COLORS.summer.canopyWarm,
    foliageWarmB: SEASON_COLORS.summer.canopyLight,
  },
  // 2: Fall / Autumn (Fiery orange, amber, and russet)
  {
    foliage1A: SEASON_COLORS.fall.canopyA,
    foliage1B: SEASON_COLORS.fall.canopyB,
    foliage2A: SEASON_COLORS.fall.foliageOrange,
    foliage2B: SEASON_COLORS.fall.foliageRed,
    foliageWarmA: SEASON_COLORS.fall.canopyWarm,
    foliageWarmB: SEASON_COLORS.fall.foliageSienna,
  },
  // 3: Winter (Frosted slate and snowy crowns)
  {
    foliage1A: SEASON_COLORS.winter.canopyA,
    foliage1B: SEASON_COLORS.winter.canopyB,
    foliage2A: SEASON_COLORS.winter.frostSlate,
    foliage2B: SEASON_COLORS.winter.snowSoft,
    foliageWarmA: SEASON_COLORS.winter.canopyWarm,
    foliageWarmB: SEASON_COLORS.winter.iceCyan,
  },
];

export function getSeasonalCanopyTokens(
  progress: number,
  isDarkMode: boolean,
): SeasonalCanopyTokens {
  // Blossom presence peaks at Spring (progress = 0)
  const distSpring = Math.min(progress, 4 - progress);
  const blossomOpacity = Math.max(0, 1 - distSpring * 1.5);

  // Snow presence peaks at Winter (progress = 3)
  const distWinter = Math.abs(progress - 3);
  const snowOpacity = Math.max(0, 1 - distWinter * 1.5);

  if (isDarkMode) {
    return {
      trunkPrimary: "var(--color-solarized-base03)",
      trunkSecondary: "var(--color-solarized-base02)",
      foliage1A: "var(--color-solarized-cyan)",
      foliage1B: "var(--color-solarized-base02)",
      foliage2A: "var(--color-solarized-blue)",
      foliage2B: "var(--color-solarized-base03)",
      foliageWarmA: "var(--color-solarized-violet)",
      foliageWarmB: "var(--color-solarized-blue)",
      blossomOpacity,
      snowOpacity,
    };
  }

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);

  const palFrom = CANOPY_SEASON_PALETTES[fromIndex]!;
  const palTo = CANOPY_SEASON_PALETTES[toIndex]!;

  const trunkPrimary = "var(--color-solarized-base01)";
  const trunkSecondary = "var(--color-solarized-base02)";

  return {
    trunkPrimary,
    trunkSecondary,
    foliage1A: interpolateHex(palFrom.foliage1A, palTo.foliage1A, blendFactor),
    foliage1B: interpolateHex(palFrom.foliage1B, palTo.foliage1B, blendFactor),
    foliage2A: interpolateHex(palFrom.foliage2A, palTo.foliage2A, blendFactor),
    foliage2B: interpolateHex(palFrom.foliage2B, palTo.foliage2B, blendFactor),
    foliageWarmA: interpolateHex(
      palFrom.foliageWarmA,
      palTo.foliageWarmA,
      blendFactor,
    ),
    foliageWarmB: interpolateHex(
      palFrom.foliageWarmB,
      palTo.foliageWarmB,
      blendFactor,
    ),
    blossomOpacity,
    snowOpacity,
  };
}

const HILLS_SEASON_PALETTES = [
  // 0: Spring (Bright sprout green hills)
  {
    back: SEASON_COLORS.spring.hillBack,
    mid: SEASON_COLORS.spring.hillMid,
    front: SEASON_COLORS.spring.hillFront,
  },
  // 1: Summer (Lush emerald hills)
  {
    back: SEASON_COLORS.summer.hillBack,
    mid: SEASON_COLORS.summer.hillMid,
    front: SEASON_COLORS.summer.hillFront,
  },
  // 2: Fall (Golden harvest / wheat hills)
  {
    back: SEASON_COLORS.fall.hillBack,
    mid: SEASON_COLORS.fall.hillMid,
    front: SEASON_COLORS.fall.hillFront,
  },
  // 3: Winter (Snow-dusted white/cyan hills)
  {
    back: SEASON_COLORS.winter.hillBack,
    mid: SEASON_COLORS.winter.hillMid,
    front: SEASON_COLORS.winter.hillFront,
  },
];

export function getSeasonalHillTokens(
  progress: number,
  isDarkMode: boolean,
): SeasonalHillTokens {
  if (isDarkMode) {
    return {
      hillBack: "var(--color-solarized-base02)",
      hillMid: "var(--color-solarized-base01)",
      hillFront: "var(--color-solarized-base02)",
    };
  }

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const pFrom = HILLS_SEASON_PALETTES[fromIndex]!;
  const pTo = HILLS_SEASON_PALETTES[toIndex]!;

  return {
    hillBack: interpolateHex(pFrom.back, pTo.back, blendFactor),
    hillMid: interpolateHex(pFrom.mid, pTo.mid, blendFactor),
    hillFront: interpolateHex(pFrom.front, pTo.front, blendFactor),
  };
}

const GRASS_SEASON_PALETTES = [
  // 0: Spring
  {
    pStart: SEASON_COLORS.spring.grass,
    pMid: BOTANICAL_COLORS.grassBladeHighlight,
    sStart: BOTANICAL_COLORS.grassBladeLight,
  },
  // 1: Summer
  {
    pStart: BOTANICAL_COLORS.grassBladeLight,
    pMid: BOTANICAL_COLORS.grassBladeHighlight,
    sStart: BOTANICAL_COLORS.grassBladeWarm,
  },
  // 2: Fall
  {
    pStart: SEASON_COLORS.fall.grass,
    pMid: SEASON_COLORS.fall.foliageGold,
    sStart: SEASON_COLORS.fall.foliageOrange,
  },
  // 3: Winter
  {
    pStart: SEASON_COLORS.winter.snowWhite,
    pMid: SEASON_COLORS.winter.frostSlate,
    sStart: SEASON_COLORS.winter.snowSoft,
  },
];

export function getSeasonalGrassTokens(
  progress: number,
  isDarkMode: boolean,
): SeasonalGrassTokens {
  const pEnd = isDarkMode
    ? "var(--color-solarized-base03)"
    : "var(--color-solarized-base2)";

  if (isDarkMode) {
    return {
      primaryStart: "var(--color-solarized-base01)",
      primaryMid: "var(--color-solarized-base02)",
      primaryEnd: pEnd,
      secondaryStart: "var(--color-solarized-base00)",
      secondaryEnd: pEnd,
    };
  }

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const pFrom = GRASS_SEASON_PALETTES[fromIndex]!;
  const pTo = GRASS_SEASON_PALETTES[toIndex]!;

  return {
    primaryStart: interpolateHex(pFrom.pStart, pTo.pStart, blendFactor),
    primaryMid: interpolateHex(pFrom.pMid, pTo.pMid, blendFactor),
    primaryEnd: pEnd,
    secondaryStart: interpolateHex(pFrom.sStart, pTo.sStart, blendFactor),
    secondaryEnd: pEnd,
  };
}

export function getSeasonalLeafPalette(
  progress: number,
  isDarkMode: boolean,
): LeafColors {
  if (isDarkMode) {
    return {
      vein: "rgba(42, 161, 152, 0.9)",
      leftTop: PROGRESS_THEME_COLORS.cyan,
      leftMid: PROGRESS_THEME_COLORS.blue,
      leftBottom: PROGRESS_THEME_COLORS.purple,
      rightTop: PROGRESS_THEME_COLORS.green,
      rightMid: PROGRESS_THEME_COLORS.cyan,
      rightBottom: PROGRESS_THEME_COLORS.darkContrast,
    };
  }

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);

  // Fall orange/amber progression (progress 1 -> 2)
  if (fromIndex === 1 && toIndex === 2) {
    return {
      vein: interpolateHex(
        BOTANICAL_COLORS.leafVeinDark,
        SEASON_COLORS.fall.foliageSienna,
        blendFactor,
      ),
      leftTop: interpolateHex(
        PROGRESS_THEME_COLORS.yellow,
        SEASON_COLORS.fall.foliageGold,
        blendFactor,
      ),
      leftMid: interpolateHex(
        PROGRESS_THEME_COLORS.orange,
        SEASON_COLORS.fall.foliageOrange,
        blendFactor,
      ),
      leftBottom: interpolateHex(
        PROGRESS_THEME_COLORS.red,
        SEASON_COLORS.fall.foliageRed,
        blendFactor,
      ),
      rightTop: interpolateHex(
        PROGRESS_THEME_COLORS.green,
        SEASON_COLORS.fall.foliageOrange,
        blendFactor,
      ),
      rightMid: interpolateHex(
        BOTANICAL_COLORS.grassBladeHighlight,
        SEASON_COLORS.fall.foliageGold,
        blendFactor,
      ),
      rightBottom: interpolateHex(
        PROGRESS_THEME_COLORS.darkContrast,
        SEASON_COLORS.fall.foliageSienna,
        blendFactor,
      ),
    };
  }

  // Peak Fall (progress 2 -> 2.5)
  if (fromIndex === 2 && blendFactor < 0.5) {
    return {
      vein: SEASON_COLORS.fall.foliageSienna,
      leftTop: SEASON_COLORS.fall.foliageGold,
      leftMid: SEASON_COLORS.fall.foliageOrange,
      leftBottom: SEASON_COLORS.fall.foliageRed,
      rightTop: SEASON_COLORS.fall.foliageOrange,
      rightMid: SEASON_COLORS.fall.foliageGold,
      rightBottom: SEASON_COLORS.fall.foliageSienna,
    };
  }

  // Default summer palette
  return {
    vein: BOTANICAL_COLORS.leafVeinDark,
    leftTop: PROGRESS_THEME_COLORS.yellow,
    leftMid: PROGRESS_THEME_COLORS.orange,
    leftBottom: PROGRESS_THEME_COLORS.red,
    rightTop: PROGRESS_THEME_COLORS.green,
    rightMid: BOTANICAL_COLORS.grassBladeHighlight,
    rightBottom: PROGRESS_THEME_COLORS.darkContrast,
  };
}
