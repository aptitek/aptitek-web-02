import type { FC } from "react";
import { keyframes, styled } from "@mui/material/styles";
import { getSeasonalGrassTokens } from "./seasonUtils";

const grassBreezeSway = keyframes`
  0%, 100% {
    transform: skewX(0deg);
  }
  50% {
    transform: skewX(2deg);
  }
`;

const flowerBreezeSway = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3deg);
  }
`;

interface GrassBladeGeneratorOptions {
  seed: number;
  xStep: number;
  baseWidthRange: [number, number];
  heightRange: [number, number];
  yBase: number;
}

function generateGrassBlades(options: GrassBladeGeneratorOptions): string {
  const { seed, xStep, baseWidthRange, heightRange, yBase } = options;
  const [baseMin, baseMax] = baseWidthRange;
  const [heightMin, heightMax] = heightRange;
  let pathString = "";

  for (let x = 0; x < 1440; x += xStep) {
    const hash = Math.sin(x * 17.13 + seed * 91.2) * 43758.5453;
    const num = 2 + Math.floor((hash - Math.floor(hash)) * 3);

    for (let i = 0; i < num; i++) {
      const h2 = Math.sin((x + i) * 31.41 + seed * 13.7) * 23421.631;
      const r = h2 - Math.floor(h2);
      const h3 = Math.cos((x + i) * 19.82 + seed * 27.9) * 54321.123;
      const r2 = h3 - Math.floor(h3);

      const w = baseMin + r * (baseMax - baseMin);
      const h = heightMin + r2 * (heightMax - heightMin);
      const lean = (r - 0.5) * 18;

      const bx0 = x + i * (w * 0.75) + (r - 0.5) * 4;
      const bx1 = bx0 + w;
      const tipX = bx0 + w * 0.5 + lean;
      const tipY = yBase - h;

      const c1X = bx0 + lean * 0.35;
      const c1Y = yBase - h * 0.5;
      const c2X = bx1 + lean * 0.35;
      const c2Y = yBase - h * 0.5;

      pathString += `M${bx0.toFixed(1)},${yBase} Q${c1X.toFixed(1)},${c1Y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} Q${c2X.toFixed(1)},${c2Y.toFixed(1)} ${bx1.toFixed(1)},${yBase} Z `;
    }
  }

  return pathString;
}

const PRIMARY_GRASS_PATH = generateGrassBlades({
  seed: 101,
  xStep: 12,
  baseWidthRange: [3.5, 6.2],
  heightRange: [46, 72],
  yBase: 76,
});

const SECONDARY_GRASS_PATH = generateGrassBlades({
  seed: 202,
  xStep: 16,
  baseWidthRange: [2.5, 5.0],
  heightRange: [32, 54],
  yBase: 76,
});

const TERTIARY_GRASS_PATH = generateGrassBlades({
  seed: 303,
  xStep: 9,
  baseWidthRange: [2.0, 3.8],
  heightRange: [16, 34],
  yBase: 76,
});

export const GrassSvg = styled("svg")({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: 76,
  zIndex: 6,
  pointerEvents: "none",
  overflow: "visible",
  "& .grass-blade-primary": {
    fill: "url(#grassBladePrimaryGrad)",
    transformBox: "fill-box",
    transformOrigin: "50% 100%",
    animation: `${grassBreezeSway} 5.2s ease-in-out infinite`,
  },
  "& .grass-blade-secondary": {
    fill: "url(#grassBladeSecondaryGrad)",
    opacity: 0.9,
    transformBox: "fill-box",
    transformOrigin: "50% 100%",
    animation: `${grassBreezeSway} 6.4s ease-in-out infinite 0.8s`,
  },
  "& .grass-blade-tertiary": {
    fill: "url(#grassBladeTertiaryGrad)",
    opacity: 0.92,
    transformBox: "fill-box",
    transformOrigin: "50% 100%",
    animation: `${grassBreezeSway} 4.6s ease-in-out infinite 0.4s`,
  },
});

const GrassFlowerSwayGroup = styled("g")({
  transformOrigin: "0px 0px",
  animation: `${flowerBreezeSway} 4.2s ease-in-out infinite`,
});

interface GrassGradientTokens {
  primaryStart: string;
  primaryMid: string;
  primaryEnd: string;
  secondaryStart: string;
  secondaryEnd: string;
  tertiaryStart: string;
  tertiaryMid: string;
  tertiaryEnd: string;
}

const DARK_GRASS_TOKENS: GrassGradientTokens = {
  primaryStart: "var(--color-solarized-base01)",
  primaryMid: "var(--color-solarized-base02)",
  primaryEnd: "var(--color-solarized-base03)",
  secondaryStart: "var(--color-solarized-base00)",
  secondaryEnd: "var(--color-solarized-base03)",
  tertiaryStart: "var(--color-solarized-cyan)",
  tertiaryMid: "var(--color-solarized-base02)",
  tertiaryEnd: "var(--color-solarized-base03)",
};

function resolveGrassTokens(
  isDarkMode: boolean,
  seasonProgress = 1.0,
): GrassGradientTokens {
  if (isDarkMode) {
    return DARK_GRASS_TOKENS;
  }

  const seasonal = getSeasonalGrassTokens(seasonProgress, false);
  return {
    primaryStart: seasonal.primaryStart,
    primaryMid: seasonal.primaryMid,
    primaryEnd: seasonal.primaryEnd,
    secondaryStart: seasonal.secondaryStart,
    secondaryEnd: seasonal.secondaryEnd,
    tertiaryStart: seasonal.secondaryStart,
    tertiaryMid: seasonal.primaryStart,
    tertiaryEnd: seasonal.primaryEnd,
  };
}

export interface ForegroundGrassBladesProps {
  isDarkMode?: boolean;
  seasonProgress?: number;
}

interface FloorFlower {
  cx: number;
  cy: number;
  scale: number;
  rotation: number;
  type: "sakura" | "daisy";
}

const SPRING_FLOOR_FLOWERS: readonly FloorFlower[] = [
  { cx: 65, cy: 22, scale: 1.4, rotation: -12, type: "sakura" },
  { cx: 140, cy: 26, scale: 1.25, rotation: 18, type: "daisy" },
  { cx: 225, cy: 18, scale: 1.5, rotation: 8, type: "sakura" },
  { cx: 315, cy: 28, scale: 1.3, rotation: -16, type: "daisy" },
  { cx: 405, cy: 20, scale: 1.55, rotation: 14, type: "sakura" },
  { cx: 495, cy: 30, scale: 1.2, rotation: -20, type: "sakura" },
  { cx: 575, cy: 18, scale: 1.45, rotation: 10, type: "daisy" },
  { cx: 660, cy: 24, scale: 1.55, rotation: -6, type: "sakura" },
  { cx: 745, cy: 28, scale: 1.3, rotation: 18, type: "daisy" },
  { cx: 835, cy: 19, scale: 1.6, rotation: -14, type: "sakura" },
  { cx: 920, cy: 26, scale: 1.3, rotation: 12, type: "sakura" },
  { cx: 1005, cy: 20, scale: 1.45, rotation: -8, type: "daisy" },
  { cx: 1090, cy: 29, scale: 1.25, rotation: 22, type: "sakura" },
  { cx: 1175, cy: 22, scale: 1.5, rotation: -10, type: "daisy" },
  { cx: 1260, cy: 28, scale: 1.35, rotation: 15, type: "sakura" },
  { cx: 1345, cy: 20, scale: 1.45, rotation: -18, type: "sakura" },
  { cx: 1415, cy: 26, scale: 1.3, rotation: 6, type: "daisy" },
];

const SPRING_FALLEN_PETALS = [
  { cx: 105, cy: 68, r: 4.2, rot: 35 },
  { cx: 175, cy: 71, r: 3.6, rot: -45 },
  { cx: 280, cy: 69, r: 4.5, rot: 15 },
  { cx: 440, cy: 72, r: 3.4, rot: -20 },
  { cx: 590, cy: 67, r: 4.4, rot: 50 },
  { cx: 685, cy: 70, r: 3.8, rot: -10 },
  { cx: 780, cy: 68, r: 4.2, rot: 40 },
  { cx: 865, cy: 71, r: 3.7, rot: -35 },
  { cx: 1030, cy: 69, r: 4.6, rot: 25 },
  { cx: 1210, cy: 70, r: 4.0, rot: -60 },
  { cx: 1365, cy: 68, r: 3.5, rot: 18 },
] as const;

const FloorFlowerNode: FC<{ flower: FloorFlower; isDarkMode?: boolean }> = ({
  flower,
  isDarkMode = false,
}) => {
  const { cx, cy, scale, rotation, type } = flower;
  const isSakura = type === "sakura";
  const stemHeight = 76 - cy;

  return (
    <g
      transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rotation})`}
    >
      <GrassFlowerSwayGroup>
        {/* Delicate organic stem rooted down to ground */}
        <path
          d={`M0,0 Q${rotation > 0 ? 3 : -3},${stemHeight * 0.5} 0,${stemHeight}`}
          stroke="var(--color-season-spring-grass)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={isDarkMode ? 0.75 : 1}
        />
        {/* 5 Petals */}
        <circle
          cx="0"
          cy="-6.5"
          r="4.8"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom-petal)"
              : "var(--color-season-spring-daisy-petal)"
          }
        />
        <circle
          cx="6.2"
          cy="-2.0"
          r="4.8"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom)"
              : "var(--color-season-spring-daisy-petal)"
          }
        />
        <circle
          cx="3.8"
          cy="5.2"
          r="4.8"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom-deep)"
              : "var(--color-season-spring-daisy-petal)"
          }
        />
        <circle
          cx="-3.8"
          cy="5.2"
          r="4.8"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom)"
              : "var(--color-season-spring-daisy-petal)"
          }
        />
        <circle
          cx="-6.2"
          cy="-2.0"
          r="4.8"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom-petal)"
              : "var(--color-season-spring-daisy-petal)"
          }
        />
        {/* Center core */}
        <circle
          cx="0"
          cy="0"
          r="2.5"
          fill={
            isSakura
              ? "var(--color-season-spring-blossom-core)"
              : "var(--color-season-spring-daisy-core)"
          }
        />
      </GrassFlowerSwayGroup>
    </g>
  );
};

const SpringFloorFlowers: FC<{ opacity: number; isDarkMode?: boolean }> = ({
  opacity,
  isDarkMode = false,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <g id="springFloorFlowers" opacity={opacity}>
      {/* Fallen petals resting gently on the grass */}
      {SPRING_FALLEN_PETALS.map((petal) => (
        <ellipse
          key={`petal-${petal.cx}-${petal.cy}`}
          cx={petal.cx}
          cy={petal.cy}
          rx={petal.r}
          ry={petal.r * 0.6}
          transform={`rotate(${petal.rot}, ${petal.cx}, ${petal.cy})`}
          fill="var(--color-season-spring-blossom-petal)"
          opacity={isDarkMode ? 0.55 : 0.88}
        />
      ))}

      {/* Spring Wildflowers and Sakura blossoms nestled in the grass */}
      {SPRING_FLOOR_FLOWERS.map((flower) => (
        <FloorFlowerNode
          key={`floor-flower-${flower.cx}-${flower.cy}`}
          flower={flower}
          isDarkMode={isDarkMode}
        />
      ))}
    </g>
  );
};

export const ForegroundGrassBlades: FC<ForegroundGrassBladesProps> = ({
  isDarkMode = false,
  seasonProgress = 1.0,
}) => {
  const tokens = resolveGrassTokens(isDarkMode, seasonProgress);
  const distSpring = Math.min(seasonProgress, 4 - seasonProgress);
  const flowerOpacity = Math.max(0, 1 - distSpring * 1.5);

  return (
    <GrassSvg
      className={isDarkMode ? "dark-mode" : undefined}
      viewBox="0 0 1440 76"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="grassBladePrimaryGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={tokens.primaryStart} />
          <stop offset="45%" stopColor={tokens.primaryMid} />
          <stop offset="96%" stopColor={tokens.primaryEnd} />
        </linearGradient>

        <linearGradient
          id="grassBladeSecondaryGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={tokens.secondaryStart} />
          <stop offset="96%" stopColor={tokens.secondaryEnd} />
        </linearGradient>

        <linearGradient
          id="grassBladeTertiaryGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={tokens.tertiaryStart} />
          <stop offset="48%" stopColor={tokens.tertiaryMid} />
          <stop offset="96%" stopColor={tokens.tertiaryEnd} />
        </linearGradient>
      </defs>

      {/* Organic, pointed grass blades rooted seamlessly to the floor */}
      <path className="grass-blade-tertiary" d={TERTIARY_GRASS_PATH} />
      <path className="grass-blade-primary" d={PRIMARY_GRASS_PATH} />
      <path className="grass-blade-secondary" d={SECONDARY_GRASS_PATH} />

      {/* Spring flowers and blossoms on the floor */}
      <SpringFloorFlowers opacity={flowerOpacity} isDarkMode={isDarkMode} />
    </GrassSvg>
  );
};
