import type { FC } from "react";
import { keyframes, styled } from "@mui/material/styles";

const grassBreezeSway = keyframes`
  0%, 100% {
    transform: skewX(0deg);
  }
  50% {
    transform: skewX(2deg);
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

const LIGHT_GRASS_TOKENS: GrassGradientTokens = {
  primaryStart: "var(--color-botanical-grass-light)",
  primaryMid: "var(--color-botanical-grass-warm)",
  primaryEnd: "var(--color-solarized-base2)",
  secondaryStart: "var(--color-botanical-grass-warm)",
  secondaryEnd: "var(--color-solarized-base2)",
  tertiaryStart: "var(--color-botanical-grass-highlight)",
  tertiaryMid: "var(--color-botanical-grass-light)",
  tertiaryEnd: "var(--color-solarized-base2)",
};

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

function resolveGrassTokens(isDarkMode: boolean): GrassGradientTokens {
  return isDarkMode ? DARK_GRASS_TOKENS : LIGHT_GRASS_TOKENS;
}

export interface ForegroundGrassBladesProps {
  isDarkMode?: boolean;
}

export const ForegroundGrassBlades: FC<ForegroundGrassBladesProps> = ({
  isDarkMode = false,
}) => {
  const tokens = resolveGrassTokens(isDarkMode);

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
    </GrassSvg>
  );
};
