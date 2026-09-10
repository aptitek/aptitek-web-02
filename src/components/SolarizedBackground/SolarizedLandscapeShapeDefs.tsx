import type { FC } from "react";
import {
  CloudsSvg,
  HillsSvg,
  TreeSvg,
  TreeWrapper,
} from "./SolarizedBackground.styles";
import { getSeasonalCanopyTokens, getSeasonalHillTokens } from "./seasonUtils";
import { SpringMeadowFlowers } from "./SpringMeadowFlowers";

export interface LandscapeProps {
  showHills?: boolean;
  showTree?: boolean;
  showClouds?: boolean;
  treeParallaxX?: number;
  treeParallaxY?: number;
  isDarkMode?: boolean;
  seasonProgress?: number;
}

const WinterSnowCaps: FC<{ opacity: number; isDarkMode?: boolean }> = ({
  opacity,
  isDarkMode = false,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <g
      id="treeWinterSnow"
      opacity={isDarkMode ? opacity * 0.78 : opacity * 0.95}
    >
      <path
        d="M165,105 C185,82 265,82 285,105 C260,116 230,112 195,116 Z"
        fill="var(--color-season-winter-snow-white)"
      />
      <path
        d="M100,165 C125,142 190,140 215,165 C185,176 150,172 120,178 Z"
        fill="var(--color-season-winter-snow-white)"
      />
      <path
        d="M260,165 C295,142 365,145 395,170 C360,182 325,178 290,182 Z"
        fill="var(--color-season-winter-snow-white)"
      />
      <path
        d="M70,205 C95,195 130,205 145,225 C125,228 100,222 80,220 Z"
        fill="var(--color-season-winter-snow-white)"
      />
      <path
        d="M360,205 C385,192 415,200 435,218 C410,222 385,216 370,218 Z"
        fill="var(--color-season-winter-snow-white)"
      />
      <path
        d="M140,265 C165,248 190,265 205,280 C185,282 165,278 145,280 Z"
        fill="var(--color-season-winter-snow-soft)"
      />
      <path
        d="M265,295 C295,275 330,285 355,298 C330,302 300,298 275,304 Z"
        fill="var(--color-season-winter-snow-soft)"
      />
    </g>
  );
};

export const LandscapeClouds: FC = () => (
  <CloudsSvg
    viewBox="0 0 1440 380"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M120 180 Q180 140 240 170 Q300 130 380 160 Q440 140 480 190 L120 190 Z"
      fill="currentColor"
      opacity="0.07"
    />
    <path
      d="M720 140 Q780 100 860 130 Q920 90 1020 120 Q1100 100 1160 150 L720 150 Z"
      fill="currentColor"
      opacity="0.09"
    />
    <path
      d="M480 220 Q540 180 620 200 Q680 170 760 210 Q820 190 870 230 L480 230 Z"
      fill="currentColor"
      opacity="0.05"
    />
  </CloudsSvg>
);

export const LandscapeHills: FC<{
  seasonProgress?: number;
  isDarkMode?: boolean;
  meadowScaleY?: number;
}> = ({ seasonProgress = 1.0, isDarkMode = false, meadowScaleY = 1 }) => {
  const hillTokens = getSeasonalHillTokens(seasonProgress, isDarkMode);
  const distSpring = Math.min(seasonProgress, 4 - seasonProgress);
  const flowerOpacity = Math.max(0, 1 - distSpring * 1.6);

  return (
    <HillsSvg
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background Rolling Hill */}
      <path
        className="hill-back-path"
        fill={hillTokens.hillBack}
        d="M0,580 C320,530 520,620 820,570 C1100,520 1280,600 1440,560 L1440,900 L0,900 Z"
      />
      {/* Midground Rolling Hill */}
      <path
        className="hill-mid-path"
        fill={hillTokens.hillMid}
        d="M0,660 C260,610 580,720 940,650 C1200,600 1340,680 1440,660 L1440,900 L0,900 Z"
      />
      {/* Foreground Anchor Hill */}
      <path
        className="hill-front-path"
        fill={hillTokens.hillFront}
        d="M0,710 C180,690 380,770 720,730 C1060,690 1260,780 1440,750 L1440,900 L0,900 Z"
      />
      {/* Soft Ridge Highlights */}
      <path
        d="M0,712 C180,692 380,772 720,732 C1060,692 1260,782 1440,752"
        stroke={
          isDarkMode
            ? "var(--color-celestial-night-sky-glow)"
            : "rgba(255, 255, 255, 0.22)"
        }
        strokeDasharray="8 12"
        strokeWidth="1.8"
      />
      {/* Spring floor wildflowers & fallen petals on meadow */}
      <SpringMeadowFlowers
        seasonProgress={seasonProgress}
        opacity={flowerOpacity}
        isDarkMode={isDarkMode}
        scaleY={meadowScaleY}
      />
    </HillsSvg>
  );
};

export const CANOPY_BUD_THRESHOLDS: readonly number[] = [
  0.18, // 0: Deep left (cx=140, cy=220)
  0.28, // 1: Deep right (cx=340, cy=230)
  0.63, // 2: Deep center (cx=230, cy=150)
  0.43, // 3: Mid left (cx=170, cy=180)
  0.53, // 4: Mid right (cx=280, cy=185)
  0.84, // 5: Mid top crown (cx=225, cy=110)
  0.76, // 6: Mid far right (cx=365, cy=190)
  0.33, // 7: Foreground far left (cx=110, cy=205)
  0.88, // 8: Foreground center (cx=230, cy=210)
  0.68, // 9: Foreground top right (cx=300, cy=140)
  0.8, // 10: Foreground top left (cx=180, cy=130)
  0.48, // 11: Foreground far right (cx=400, cy=215)
  0.15, // 12: Outer bud left (cx=95, cy=170)
  0.23, // 13: Outer bud right (cx=435, cy=195)
  0.72, // 14: Outer bud top right (cx=330, cy=85)
  0.38, // 15: Outer bud top left (cx=160, cy=90)
  0.58, // 16: Outer bud bottom right (cx=410, cy=250)
];

export function getCanopyClusterFill(
  clusterIndex: number,
  gradType: "grad1" | "grad2" | "warm",
  normalizedProgress: number,
): string {
  if (normalizedProgress >= 1.0) {
    if (gradType === "grad1") return "url(#treeCanopyGrad1)";
    if (gradType === "grad2") return "url(#treeCanopyGrad2)";
    return "url(#treeCanopyWarm)";
  }

  const threshold = CANOPY_BUD_THRESHOLDS[clusterIndex] ?? 0.5;
  const isGreen = normalizedProgress >= threshold;
  const suffix = isGreen ? "Summer" : "Spring";

  if (gradType === "grad1") return `url(#treeCanopyGrad1${suffix})`;
  if (gradType === "grad2") return `url(#treeCanopyGrad2${suffix})`;
  return `url(#treeCanopyWarm${suffix})`;
}

export const PeacefulTreeGraphic: FC<{
  parallaxX?: number;
  parallaxY?: number;
  isDarkMode?: boolean;
  seasonProgress?: number;
}> = ({
  parallaxX = 0,
  parallaxY = 0,
  isDarkMode = false,
  seasonProgress = 1.0,
}) => {
  const tokens = getSeasonalCanopyTokens(seasonProgress, isDarkMode);
  const springTokens = getSeasonalCanopyTokens(0.0, isDarkMode);
  const summerTokens = getSeasonalCanopyTokens(1.0, isDarkMode);
  const normalizedProgress = ((seasonProgress % 4) + 4) % 4;
  const transformStyle = `translate3d(${parallaxX * 0.6}px, ${parallaxY * 0.3}px, 0)`;

  return (
    <TreeWrapper
      id="peacefulTreeContainer"
      sx={{ transform: transformStyle }}
      aria-hidden="true"
    >
      <TreeSvg viewBox="0 0 500 600">
        <defs>
          <linearGradient
            id="treeTrunkGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={tokens.trunkPrimary} />
            <stop offset="100%" stopColor={tokens.trunkSecondary} />
          </linearGradient>
          <linearGradient
            id="treeCanopyGrad1"
            x1="20%"
            y1="0%"
            x2="80%"
            y2="100%"
          >
            <stop offset="0%" stopColor={tokens.foliage1A} />
            <stop offset="100%" stopColor={tokens.foliage1B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyGrad2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={tokens.foliage2A} />
            <stop offset="100%" stopColor={tokens.foliage2B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyWarm"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={tokens.foliageWarmA} />
            <stop offset="100%" stopColor={tokens.foliageWarmB} />
          </linearGradient>

          {/* Spring pure blossom pink canopy gradients */}
          <linearGradient
            id="treeCanopyGrad1Spring"
            x1="20%"
            y1="0%"
            x2="80%"
            y2="100%"
          >
            <stop offset="0%" stopColor={springTokens.foliage1A} />
            <stop offset="100%" stopColor={springTokens.foliage1B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyGrad2Spring"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={springTokens.foliage2A} />
            <stop offset="100%" stopColor={springTokens.foliage2B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyWarmSpring"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={springTokens.foliageWarmA} />
            <stop offset="100%" stopColor={springTokens.foliageWarmB} />
          </linearGradient>

          {/* Summer pure botanical green canopy gradients */}
          <linearGradient
            id="treeCanopyGrad1Summer"
            x1="20%"
            y1="0%"
            x2="80%"
            y2="100%"
          >
            <stop offset="0%" stopColor={summerTokens.foliage1A} />
            <stop offset="100%" stopColor={summerTokens.foliage1B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyGrad2Summer"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={summerTokens.foliage2A} />
            <stop offset="100%" stopColor={summerTokens.foliage2B} />
          </linearGradient>
          <linearGradient
            id="treeCanopyWarmSummer"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={summerTokens.foliageWarmA} />
            <stop offset="100%" stopColor={summerTokens.foliageWarmB} />
          </linearGradient>
        </defs>

        {/* Root mound shadow */}
        <ellipse
          cx="220"
          cy="565"
          rx="140"
          ry="24"
          fill="rgba(0, 0, 0, 0.16)"
        />

        {/* Organic Trunk & Limbs */}
        <g id="treeTrunk">
          <path
            d="M170,570 C190,530 200,480 205,430 C210,380 212,320 220,260 C228,210 240,160 250,130 C258,165 264,220 258,280 C252,340 250,420 262,490 C268,525 285,555 310,570 C260,565 215,565 170,570 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M216,330 C180,310 145,285 115,240 C135,240 165,260 195,285 C205,293 214,310 216,330 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M145,260 C120,230 85,210 60,195 C75,198 105,215 130,235 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M255,295 C295,275 340,260 385,245 C355,258 315,285 258,325 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M320,265 C360,240 405,225 440,215 C410,230 370,255 330,280 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M242,175 C230,125 210,85 190,65 C205,80 222,110 236,155 Z"
            fill="url(#treeTrunkGrad)"
          />
          <path
            d="M248,160 C265,115 295,80 325,55 C305,80 280,115 256,150 Z"
            fill="url(#treeTrunkGrad)"
          />
        </g>

        {/* Swaying Foliage Crown Clusters */}
        <g className="tree-swaying-canopy">
          {/* Deep canopy layer */}
          <ellipse
            cx="140"
            cy="220"
            rx="75"
            ry="55"
            fill={getCanopyClusterFill(0, "grad2", normalizedProgress)}
            opacity="0.95"
          />
          <ellipse
            cx="340"
            cy="230"
            rx="90"
            ry="60"
            fill={getCanopyClusterFill(1, "grad2", normalizedProgress)}
            opacity="0.9"
          />
          <ellipse
            cx="230"
            cy="150"
            rx="100"
            ry="70"
            fill={getCanopyClusterFill(2, "grad2", normalizedProgress)}
            opacity="0.9"
          />

          {/* Mid canopy clusters */}
          <ellipse
            cx="170"
            cy="180"
            rx="85"
            ry="65"
            fill={getCanopyClusterFill(3, "grad1", normalizedProgress)}
          />
          <ellipse
            cx="280"
            cy="185"
            rx="85"
            ry="62"
            fill={getCanopyClusterFill(4, "grad1", normalizedProgress)}
          />
          <ellipse
            cx="225"
            cy="110"
            rx="80"
            ry="55"
            fill={getCanopyClusterFill(5, "grad1", normalizedProgress)}
          />
          <ellipse
            cx="365"
            cy="190"
            rx="65"
            ry="50"
            fill={getCanopyClusterFill(6, "warm", normalizedProgress)}
            opacity="0.92"
          />

          {/* Foreground sun/wind kissed puffs */}
          <ellipse
            cx="110"
            cy="205"
            rx="55"
            ry="42"
            fill={getCanopyClusterFill(7, "grad1", normalizedProgress)}
          />
          <ellipse
            cx="230"
            cy="210"
            rx="70"
            ry="50"
            fill={getCanopyClusterFill(8, "grad1", normalizedProgress)}
          />
          <ellipse
            cx="300"
            cy="140"
            rx="65"
            ry="48"
            fill={getCanopyClusterFill(9, "warm", normalizedProgress)}
          />
          <ellipse
            cx="180"
            cy="130"
            rx="58"
            ry="44"
            fill={getCanopyClusterFill(10, "warm", normalizedProgress)}
            opacity="0.88"
          />
          <ellipse
            cx="400"
            cy="215"
            rx="52"
            ry="38"
            fill={getCanopyClusterFill(11, "grad1", normalizedProgress)}
          />

          {/* Outer leaf accents */}
          <circle
            cx="95"
            cy="170"
            r="14"
            fill={getCanopyClusterFill(12, "warm", normalizedProgress)}
          />
          <circle
            cx="435"
            cy="195"
            r="12"
            fill={getCanopyClusterFill(13, "grad1", normalizedProgress)}
          />
          <circle
            cx="330"
            cy="85"
            r="15"
            fill={getCanopyClusterFill(14, "grad1", normalizedProgress)}
          />
          <circle
            cx="160"
            cy="90"
            r="13"
            fill={getCanopyClusterFill(15, "warm", normalizedProgress)}
          />
          <circle
            cx="410"
            cy="250"
            r="11"
            fill={getCanopyClusterFill(16, "warm", normalizedProgress)}
          />

          {/* Seasonal snow caps and drifts in winter */}
          <WinterSnowCaps
            opacity={tokens.snowOpacity}
            isDarkMode={isDarkMode}
          />
        </g>
      </TreeSvg>
    </TreeWrapper>
  );
};

export const PeacefulTreeSvg = PeacefulTreeGraphic;
