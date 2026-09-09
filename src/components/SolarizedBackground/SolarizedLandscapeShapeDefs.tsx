import type { FC } from "react";
import {
  CloudsSvg,
  HillsSvg,
  TreeSvg,
  TreeWrapper,
} from "./SolarizedBackground.styles";

export interface LandscapeProps {
  showHills?: boolean;
  showTree?: boolean;
  showClouds?: boolean;
  treeParallaxX?: number;
  treeParallaxY?: number;
  isDarkMode?: boolean;
}

export interface TreeGradientTokens {
  trunkPrimary: string;
  trunkSecondary: string;
  foliage1A: string;
  foliage1B: string;
  foliage2A: string;
  foliage2B: string;
  foliageWarmA: string;
  foliageWarmB: string;
}

function resolveTreeGradientTokens(isDarkMode: boolean): TreeGradientTokens {
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
    };
  }

  return {
    trunkPrimary: "var(--color-solarized-base01)",
    trunkSecondary: "var(--color-solarized-base02)",
    foliage1A: "var(--color-solarized-green)",
    foliage1B: "var(--color-solarized-base01)",
    foliage2A: "var(--color-solarized-cyan)",
    foliage2B: "var(--color-solarized-base02)",
    foliageWarmA: "var(--color-solarized-yellow)",
    foliageWarmB: "var(--color-solarized-orange)",
  };
}

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

export const LandscapeHills: FC = () => (
  <HillsSvg
    viewBox="0 0 1440 900"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {/* Background Rolling Hill */}
    <path
      className="hill-back-path"
      d="M0,580 C320,530 520,620 820,570 C1100,520 1280,600 1440,560 L1440,900 L0,900 Z"
    />
    {/* Midground Rolling Hill */}
    <path
      className="hill-mid-path"
      d="M0,660 C260,610 580,720 940,650 C1200,600 1340,680 1440,660 L1440,900 L0,900 Z"
    />
    {/* Foreground Anchor Hill */}
    <path
      className="hill-front-path"
      d="M0,710 C180,690 380,770 720,730 C1060,690 1260,780 1440,750 L1440,900 L0,900 Z"
    />
    {/* Soft Ridge Highlights */}
    <path
      d="M0,712 C180,692 380,772 720,732 C1060,692 1260,782 1440,752"
      stroke="rgba(255, 255, 255, 0.22)"
      strokeDasharray="8 12"
      strokeWidth="1.8"
    />
  </HillsSvg>
);

export const PeacefulTreeGraphic: FC<{
  parallaxX?: number;
  parallaxY?: number;
  isDarkMode?: boolean;
}> = ({ parallaxX = 0, parallaxY = 0, isDarkMode = false }) => {
  const tokens = resolveTreeGradientTokens(isDarkMode);
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
            fill="url(#treeCanopyGrad2)"
            opacity="0.95"
          />
          <ellipse
            cx="340"
            cy="230"
            rx="90"
            ry="60"
            fill="url(#treeCanopyGrad2)"
            opacity="0.9"
          />
          <ellipse
            cx="230"
            cy="150"
            rx="100"
            ry="70"
            fill="url(#treeCanopyGrad2)"
            opacity="0.9"
          />

          {/* Mid canopy clusters */}
          <ellipse
            cx="170"
            cy="180"
            rx="85"
            ry="65"
            fill="url(#treeCanopyGrad1)"
          />
          <ellipse
            cx="280"
            cy="185"
            rx="85"
            ry="62"
            fill="url(#treeCanopyGrad1)"
          />
          <ellipse
            cx="225"
            cy="110"
            rx="80"
            ry="55"
            fill="url(#treeCanopyGrad1)"
          />
          <ellipse
            cx="365"
            cy="190"
            rx="65"
            ry="50"
            fill="url(#treeCanopyWarm)"
            opacity="0.92"
          />

          {/* Foreground sun/wind kissed puffs */}
          <ellipse
            cx="110"
            cy="205"
            rx="55"
            ry="42"
            fill="url(#treeCanopyGrad1)"
          />
          <ellipse
            cx="230"
            cy="210"
            rx="70"
            ry="50"
            fill="url(#treeCanopyGrad1)"
          />
          <ellipse
            cx="300"
            cy="140"
            rx="65"
            ry="48"
            fill="url(#treeCanopyWarm)"
          />
          <ellipse
            cx="180"
            cy="130"
            rx="58"
            ry="44"
            fill="url(#treeCanopyWarm)"
            opacity="0.88"
          />
          <ellipse
            cx="400"
            cy="215"
            rx="52"
            ry="38"
            fill="url(#treeCanopyGrad1)"
          />

          {/* Outer leaf accents */}
          <circle cx="95" cy="170" r="14" fill="url(#treeCanopyWarm)" />
          <circle cx="435" cy="195" r="12" fill="url(#treeCanopyGrad1)" />
          <circle cx="330" cy="85" r="15" fill="url(#treeCanopyGrad1)" />
          <circle cx="160" cy="90" r="13" fill="url(#treeCanopyWarm)" />
          <circle cx="410" cy="250" r="11" fill="url(#treeCanopyWarm)" />
        </g>
      </TreeSvg>
    </TreeWrapper>
  );
};
