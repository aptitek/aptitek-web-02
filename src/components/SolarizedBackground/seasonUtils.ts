import {
  BOTANICAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
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

const CANOPY_NIGHT_SEASON_PALETTES = [
  // 0: Spring (Twilight cherry blossom plums & dusty rose)
  {
    foliage1A: SEASON_NIGHT_COLORS.spring.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.spring.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.spring.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.spring.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.spring.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.spring.canopyLight,
  },
  // 1: Summer (Deep nocturnal botanical greens)
  {
    foliage1A: SEASON_NIGHT_COLORS.summer.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.summer.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.summer.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.summer.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.summer.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.summer.canopyLight,
  },
  // 2: Fall / Autumn (Deep nocturnal warm russets & chestnut)
  {
    foliage1A: SEASON_NIGHT_COLORS.fall.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.fall.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.fall.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.fall.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.fall.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.fall.canopyLight,
  },
  // 3: Winter (Frosted nocturnal slate & moonlit pine)
  {
    foliage1A: SEASON_NIGHT_COLORS.winter.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.winter.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.winter.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.winter.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.winter.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.winter.canopyLight,
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

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);

  const palettes = isDarkMode
    ? CANOPY_NIGHT_SEASON_PALETTES
    : CANOPY_SEASON_PALETTES;

  const palFrom = palettes[fromIndex]!;
  const palTo = palettes[toIndex]!;

  const trunkPrimary = isDarkMode
    ? "var(--color-solarized-base03)"
    : "var(--color-solarized-base01)";
  const trunkSecondary = isDarkMode
    ? "var(--color-solarized-base02)"
    : "var(--color-solarized-base00)";

  // Spring to Summer transition (0 -> 1): Avoid muddy intermediate colors
  const springToSummer = fromIndex === 0 && toIndex === 1;
  const effectiveBlend = springToSummer
    ? blendFactor >= 0.5
      ? 1
      : 0
    : blendFactor;

  return {
    trunkPrimary,
    trunkSecondary,
    foliage1A: interpolateHex(
      palFrom.foliage1A,
      palTo.foliage1A,
      effectiveBlend,
    ),
    foliage1B: interpolateHex(
      palFrom.foliage1B,
      palTo.foliage1B,
      effectiveBlend,
    ),
    foliage2A: interpolateHex(
      palFrom.foliage2A,
      palTo.foliage2A,
      effectiveBlend,
    ),
    foliage2B: interpolateHex(
      palFrom.foliage2B,
      palTo.foliage2B,
      effectiveBlend,
    ),
    foliageWarmA: interpolateHex(
      palFrom.foliageWarmA,
      palTo.foliageWarmA,
      effectiveBlend,
    ),
    foliageWarmB: interpolateHex(
      palFrom.foliageWarmB,
      palTo.foliageWarmB,
      effectiveBlend,
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

const HILLS_NIGHT_SEASON_PALETTES = [
  // 0: Spring
  {
    back: SEASON_NIGHT_COLORS.spring.hillBack,
    mid: SEASON_NIGHT_COLORS.spring.hillMid,
    front: SEASON_NIGHT_COLORS.spring.hillFront,
  },
  // 1: Summer
  {
    back: SEASON_NIGHT_COLORS.summer.hillBack,
    mid: SEASON_NIGHT_COLORS.summer.hillMid,
    front: SEASON_NIGHT_COLORS.summer.hillFront,
  },
  // 2: Fall
  {
    back: SEASON_NIGHT_COLORS.fall.hillBack,
    mid: SEASON_NIGHT_COLORS.fall.hillMid,
    front: SEASON_NIGHT_COLORS.fall.hillFront,
  },
  // 3: Winter
  {
    back: SEASON_NIGHT_COLORS.winter.hillBack,
    mid: SEASON_NIGHT_COLORS.winter.hillMid,
    front: SEASON_NIGHT_COLORS.winter.hillFront,
  },
];

export function getSeasonalHillTokens(
  progress: number,
  isDarkMode: boolean,
): SeasonalHillTokens {
  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const palettes = isDarkMode
    ? HILLS_NIGHT_SEASON_PALETTES
    : HILLS_SEASON_PALETTES;
  const pFrom = palettes[fromIndex]!;
  const pTo = palettes[toIndex]!;

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

const GRASS_NIGHT_SEASON_PALETTES = [
  // 0: Spring
  {
    pStart: SEASON_NIGHT_COLORS.spring.grass,
    pMid: SEASON_NIGHT_COLORS.spring.hillFront,
    sStart: SEASON_NIGHT_COLORS.spring.hillMid,
  },
  // 1: Summer
  {
    pStart: SEASON_NIGHT_COLORS.summer.grass,
    pMid: SEASON_NIGHT_COLORS.summer.hillFront,
    sStart: SEASON_NIGHT_COLORS.summer.hillMid,
  },
  // 2: Fall
  {
    pStart: SEASON_NIGHT_COLORS.fall.grass,
    pMid: SEASON_NIGHT_COLORS.fall.hillFront,
    sStart: SEASON_NIGHT_COLORS.fall.hillMid,
  },
  // 3: Winter
  {
    pStart: SEASON_NIGHT_COLORS.winter.grass,
    pMid: SEASON_NIGHT_COLORS.winter.hillFront,
    sStart: SEASON_NIGHT_COLORS.winter.hillMid,
  },
];

export function getSeasonalGrassTokens(
  progress: number,
  isDarkMode: boolean,
): SeasonalGrassTokens {
  const pEnd = isDarkMode
    ? "var(--color-solarized-base03)"
    : "var(--color-solarized-base2)";

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const palettes = isDarkMode
    ? GRASS_NIGHT_SEASON_PALETTES
    : GRASS_SEASON_PALETTES;
  const pFrom = palettes[fromIndex]!;
  const pTo = palettes[toIndex]!;

  return {
    primaryStart: interpolateHex(pFrom.pStart, pTo.pStart, blendFactor),
    primaryMid: interpolateHex(pFrom.pMid, pTo.pMid, blendFactor),
    primaryEnd: pEnd,
    secondaryStart: interpolateHex(pFrom.sStart, pTo.sStart, blendFactor),
    secondaryEnd: pEnd,
  };
}

function getDarkSeasonalLeafPalette(
  fromIndex: number,
  toIndex: number,
  blendFactor: number,
): LeafColors {
  // Fall transition (progress 1 -> 2)
  if (fromIndex === 1 && toIndex === 2) {
    return {
      vein: interpolateHex(
        SEASON_NIGHT_COLORS.summer.leafVein,
        SEASON_NIGHT_COLORS.fall.foliageSienna,
        blendFactor,
      ),
      leftTop: interpolateHex(
        SEASON_NIGHT_COLORS.summer.canopyWarm,
        SEASON_NIGHT_COLORS.fall.foliageGold,
        blendFactor,
      ),
      leftMid: interpolateHex(
        SEASON_NIGHT_COLORS.summer.canopyA,
        SEASON_NIGHT_COLORS.fall.foliageOrange,
        blendFactor,
      ),
      leftBottom: interpolateHex(
        SEASON_NIGHT_COLORS.summer.canopyB,
        SEASON_NIGHT_COLORS.fall.foliageRed,
        blendFactor,
      ),
      rightTop: interpolateHex(
        SEASON_NIGHT_COLORS.summer.canopyWarm,
        SEASON_NIGHT_COLORS.fall.foliageOrange,
        blendFactor,
      ),
      rightMid: interpolateHex(
        SEASON_NIGHT_COLORS.summer.canopyLight,
        SEASON_NIGHT_COLORS.fall.foliageGold,
        blendFactor,
      ),
      rightBottom: interpolateHex(
        SEASON_NIGHT_COLORS.summer.leafBottom,
        SEASON_NIGHT_COLORS.fall.foliageSienna,
        blendFactor,
      ),
    };
  }

  // Peak Fall
  if (fromIndex === 2 && blendFactor < 0.5) {
    return {
      vein: SEASON_NIGHT_COLORS.fall.foliageSienna,
      leftTop: SEASON_NIGHT_COLORS.fall.foliageGold,
      leftMid: SEASON_NIGHT_COLORS.fall.foliageOrange,
      leftBottom: SEASON_NIGHT_COLORS.fall.foliageRed,
      rightTop: SEASON_NIGHT_COLORS.fall.foliageOrange,
      rightMid: SEASON_NIGHT_COLORS.fall.foliageGold,
      rightBottom: SEASON_NIGHT_COLORS.fall.foliageSienna,
    };
  }

  // Winter night
  if (fromIndex === 3 || (fromIndex === 2 && blendFactor >= 0.5)) {
    return {
      vein: SEASON_NIGHT_COLORS.winter.leafVein,
      leftTop: SEASON_NIGHT_COLORS.winter.canopyWarm,
      leftMid: SEASON_NIGHT_COLORS.winter.frostSlate,
      leftBottom: SEASON_NIGHT_COLORS.winter.canopyB,
      rightTop: SEASON_NIGHT_COLORS.winter.snowWhite,
      rightMid: SEASON_NIGHT_COLORS.winter.snowSoft,
      rightBottom: SEASON_NIGHT_COLORS.winter.leafBottom,
    };
  }

  // Spring night
  if (fromIndex === 0) {
    return {
      vein: SEASON_NIGHT_COLORS.spring.leafVein,
      leftTop: SEASON_NIGHT_COLORS.spring.canopyWarm,
      leftMid: SEASON_NIGHT_COLORS.spring.canopyA,
      leftBottom: SEASON_NIGHT_COLORS.spring.canopyB,
      rightTop: SEASON_NIGHT_COLORS.spring.blossom,
      rightMid: SEASON_NIGHT_COLORS.spring.blossomPetal,
      rightBottom: SEASON_NIGHT_COLORS.spring.leafBottom,
    };
  }

  // Default: Summer night
  return {
    vein: SEASON_NIGHT_COLORS.summer.leafVein,
    leftTop: SEASON_NIGHT_COLORS.summer.canopyWarm,
    leftMid: SEASON_NIGHT_COLORS.summer.canopyA,
    leftBottom: SEASON_NIGHT_COLORS.summer.canopyB,
    rightTop: SEASON_NIGHT_COLORS.summer.canopyWarm,
    rightMid: SEASON_NIGHT_COLORS.summer.canopyLight,
    rightBottom: SEASON_NIGHT_COLORS.summer.leafBottom,
  };
}

function getLightSeasonalLeafPalette(
  fromIndex: number,
  toIndex: number,
  blendFactor: number,
): LeafColors {
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

export function getSeasonalLeafPalette(
  progress: number,
  isDarkMode: boolean,
): LeafColors {
  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);

  return isDarkMode
    ? getDarkSeasonalLeafPalette(fromIndex, toIndex, blendFactor)
    : getLightSeasonalLeafPalette(fromIndex, toIndex, blendFactor);
}
