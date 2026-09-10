import type { FC } from "react";
import { keyframes, styled } from "@mui/material/styles";

interface MeadowFlower {
  cx: number;
  cy: number;
  scale: number;
  rotation: number;
  type: "sakura" | "daisy";
}

const SPRING_MEADOW_FLOWERS: readonly MeadowFlower[] = [
  { cx: 70, cy: 755, scale: 1.4, rotation: -10, type: "sakura" },
  { cx: 135, cy: 790, scale: 1.7, rotation: 15, type: "daisy" },
  { cx: 195, cy: 835, scale: 2.1, rotation: -8, type: "sakura" },
  { cx: 260, cy: 820, scale: 2.3, rotation: 22, type: "sakura" },
  { cx: 330, cy: 845, scale: 1.9, rotation: -14, type: "daisy" },
  { cx: 405, cy: 810, scale: 1.6, rotation: 12, type: "sakura" },
  { cx: 475, cy: 785, scale: 1.5, rotation: -18, type: "daisy" },
  { cx: 540, cy: 825, scale: 2.0, rotation: 8, type: "sakura" },
  { cx: 615, cy: 775, scale: 1.6, rotation: -12, type: "sakura" },
  { cx: 685, cy: 840, scale: 2.2, rotation: 18, type: "daisy" },
  { cx: 760, cy: 765, scale: 1.5, rotation: -6, type: "sakura" },
  { cx: 825, cy: 815, scale: 2.1, rotation: 25, type: "sakura" },
  { cx: 895, cy: 755, scale: 1.4, rotation: -15, type: "daisy" },
  { cx: 965, cy: 805, scale: 2.0, rotation: 10, type: "sakura" },
  { cx: 1040, cy: 745, scale: 1.4, rotation: -8, type: "daisy" },
  { cx: 1115, cy: 820, scale: 2.2, rotation: 20, type: "sakura" },
  { cx: 1190, cy: 785, scale: 1.7, rotation: -16, type: "daisy" },
  { cx: 1265, cy: 845, scale: 2.3, rotation: 12, type: "sakura" },
  { cx: 1335, cy: 820, scale: 1.8, rotation: -22, type: "sakura" },
  { cx: 1400, cy: 795, scale: 1.5, rotation: 14, type: "daisy" },
];

const SPRING_MEADOW_FALLEN_PETALS = [
  { cx: 160, cy: 815, rx: 6, ry: 3.6, rot: 35 },
  { cx: 220, cy: 845, rx: 5.5, ry: 3.2, rot: -40 },
  { cx: 285, cy: 810, rx: 6.5, ry: 3.8, rot: 15 },
  { cx: 350, cy: 860, rx: 5.8, ry: 3.4, rot: 60 },
  { cx: 430, cy: 825, rx: 6.2, ry: 3.7, rot: -25 },
  { cx: 505, cy: 855, rx: 5.4, ry: 3.1, rot: 40 },
  { cx: 580, cy: 815, rx: 6.0, ry: 3.5, rot: -30 },
  { cx: 650, cy: 865, rx: 5.6, ry: 3.3, rot: 20 },
  { cx: 735, cy: 830, rx: 6.4, ry: 3.8, rot: -50 },
  { cx: 805, cy: 855, rx: 5.5, ry: 3.2, rot: 25 },
  { cx: 870, cy: 800, rx: 5.8, ry: 3.4, rot: -15 },
  { cx: 940, cy: 845, rx: 6.0, ry: 3.5, rot: 45 },
  { cx: 1020, cy: 810, rx: 5.2, ry: 3.0, rot: -35 },
  { cx: 1100, cy: 850, rx: 5.8, ry: 3.4, rot: 15 },
  { cx: 1170, cy: 820, rx: 5.4, ry: 3.1, rot: -60 },
  { cx: 1250, cy: 860, rx: 6.2, ry: 3.6, rot: 30 },
  { cx: 1330, cy: 835, rx: 5.0, ry: 2.8, rot: -20 },
] as const;

const meadowFlowerSway = keyframes`
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
`;

const MeadowFlowerSwayGroup = styled("g")({
  transformOrigin: "0px 0px",
  animation: `${meadowFlowerSway} 5.2s ease-in-out infinite`,
});

export interface FlowerBloomSchedule {
  bloomIn: number;
  bloomOut: number;
}

export const SPRING_FLOWER_SCHEDULES: readonly FlowerBloomSchedule[] = [
  { bloomIn: 3.38, bloomOut: 0.25 }, // 0: cx=70
  { bloomIn: 3.55, bloomOut: 0.45 }, // 1: cx=135
  { bloomIn: 3.42, bloomOut: 0.35 }, // 2: cx=195
  { bloomIn: 3.68, bloomOut: 0.6 }, // 3: cx=260
  { bloomIn: 3.48, bloomOut: 0.28 }, // 4: cx=330
  { bloomIn: 3.62, bloomOut: 0.52 }, // 5: cx=405
  { bloomIn: 3.75, bloomOut: 0.7 }, // 6: cx=475
  { bloomIn: 3.4, bloomOut: 0.3 }, // 7: cx=540
  { bloomIn: 3.58, bloomOut: 0.48 }, // 8: cx=615
  { bloomIn: 3.7, bloomOut: 0.65 }, // 9: cx=685
  { bloomIn: 3.45, bloomOut: 0.38 }, // 10: cx=760
  { bloomIn: 3.65, bloomOut: 0.55 }, // 11: cx=825
  { bloomIn: 3.82, bloomOut: 0.75 }, // 12: cx=895
  { bloomIn: 3.5, bloomOut: 0.42 }, // 13: cx=965
  { bloomIn: 3.72, bloomOut: 0.62 }, // 14: cx=1040
  { bloomIn: 3.6, bloomOut: 0.5 }, // 15: cx=1115
  { bloomIn: 3.78, bloomOut: 0.72 }, // 16: cx=1190
  { bloomIn: 3.52, bloomOut: 0.4 }, // 17: cx=1265
  { bloomIn: 3.85, bloomOut: 0.78 }, // 18: cx=1335
  { bloomIn: 3.66, bloomOut: 0.58 }, // 19: cx=1400
];

export const SPRING_PETAL_SCHEDULES: readonly FlowerBloomSchedule[] = [
  { bloomIn: 3.45, bloomOut: 0.32 }, // 0: cx=160
  { bloomIn: 3.52, bloomOut: 0.4 }, // 1: cx=220
  { bloomIn: 3.6, bloomOut: 0.5 }, // 2: cx=285
  { bloomIn: 3.48, bloomOut: 0.36 }, // 3: cx=350
  { bloomIn: 3.7, bloomOut: 0.64 }, // 4: cx=430
  { bloomIn: 3.55, bloomOut: 0.44 }, // 5: cx=505
  { bloomIn: 3.65, bloomOut: 0.56 }, // 6: cx=580
  { bloomIn: 3.75, bloomOut: 0.72 }, // 7: cx=650
  { bloomIn: 3.42, bloomOut: 0.28 }, // 8: cx=735
  { bloomIn: 3.62, bloomOut: 0.52 }, // 9: cx=805
  { bloomIn: 3.5, bloomOut: 0.38 }, // 10: cx=870
  { bloomIn: 3.68, bloomOut: 0.6 }, // 11: cx=940
  { bloomIn: 3.58, bloomOut: 0.46 }, // 12: cx=1020
  { bloomIn: 3.78, bloomOut: 0.74 }, // 13: cx=1100
  { bloomIn: 3.46, bloomOut: 0.34 }, // 14: cx=1170
  { bloomIn: 3.72, bloomOut: 0.66 }, // 15: cx=1250
  { bloomIn: 3.82, bloomOut: 0.78 }, // 16: cx=1330
];

export function getFlowerBloomFactor(
  normalizedProgress: number,
  bloomIn: number,
  bloomOut: number,
  ramp = 0.04,
): number {
  // 1. Winter into Spring thaw (3.0 <= p < 4.0)
  if (normalizedProgress >= 3.0) {
    if (normalizedProgress < bloomIn) return 0;
    return Math.min(1, (normalizedProgress - bloomIn) / ramp);
  }

  // 2. Spring into Summer (0.0 <= p < 1.0)
  if (normalizedProgress < 1.0) {
    if (normalizedProgress < bloomOut) return 1;
    return Math.max(0, 1 - (normalizedProgress - bloomOut) / ramp);
  }

  // 3. Summer, Fall, and deep Winter (1.0 <= p < 3.0)
  return 0;
}

interface FlowerPalette {
  petalTop: string;
  petalMid: string;
  petalDeep: string;
  coreFill: string;
  innerFill: string;
}

const SAKURA_PALETTE: FlowerPalette = {
  petalTop: "var(--color-season-spring-blossom-petal)",
  petalMid: "var(--color-season-spring-blossom)",
  petalDeep: "var(--color-season-spring-blossom-deep)",
  coreFill: "var(--color-season-spring-blossom-core)",
  innerFill: "rgba(255, 255, 255, 0.8)",
};

const DAISY_PALETTE: FlowerPalette = {
  petalTop: "var(--color-season-spring-daisy-petal)",
  petalMid: "var(--color-season-spring-daisy-petal)",
  petalDeep: "var(--color-season-spring-daisy-petal)",
  coreFill: "var(--color-season-spring-daisy-core)",
  innerFill: "var(--color-solarized-orange)",
};

function getFlowerPalette(type: "sakura" | "daisy"): FlowerPalette {
  return type === "sakura" ? SAKURA_PALETTE : DAISY_PALETTE;
}

interface MeadowFlowerItemProps {
  flower: (typeof SPRING_MEADOW_FLOWERS)[number];
  isDarkMode: boolean;
  scaleY?: number;
  bloomFactor?: number;
}

const MeadowFlowerItem: FC<MeadowFlowerItemProps> = ({
  flower,
  isDarkMode,
  scaleY = 1,
  bloomFactor = 1,
}) => {
  if (bloomFactor <= 0.01) return null;

  const palette = getFlowerPalette(flower.type);
  const currentScale = flower.scale * bloomFactor;
  const sepalOpacity = isDarkMode ? 0.75 : 0.88;
  const innerOpacity = isDarkMode ? 0.45 : 0.75;

  return (
    <g
      transform={`translate(${flower.cx}, ${flower.cy}) scale(1, ${scaleY}) scale(${currentScale}) rotate(${flower.rotation})`}
      opacity={bloomFactor}
    >
      <MeadowFlowerSwayGroup>
        {/* Green leaf sepals at flower base */}
        <path
          d="M-5,4 C-9,2 -9,-2 -3,0 Z"
          fill="var(--color-season-spring-grass)"
          opacity={sepalOpacity}
        />
        <path
          d="M5,4 C9,2 9,-2 3,0 Z"
          fill="var(--color-season-spring-grass)"
          opacity={sepalOpacity}
        />
        {/* 5 Petals */}
        <circle cx="0" cy="-6" r="4.8" fill={palette.petalTop} />
        <circle cx="5.8" cy="-1.9" r="4.8" fill={palette.petalMid} />
        <circle cx="3.6" cy="4.9" r="4.8" fill={palette.petalDeep} />
        <circle cx="-3.6" cy="4.9" r="4.8" fill={palette.petalDeep} />
        <circle cx="-5.8" cy="-1.9" r="4.8" fill={palette.petalMid} />
        {/* Center Core */}
        <circle cx="0" cy="0" r="2.5" fill={palette.coreFill} />
        <circle
          cx="0"
          cy="0"
          r="1.2"
          fill={palette.innerFill}
          opacity={innerOpacity}
        />
      </MeadowFlowerSwayGroup>
    </g>
  );
};

interface MeadowPetalItemProps {
  petal: (typeof SPRING_MEADOW_FALLEN_PETALS)[number];
  idx: number;
  normalizedProgress: number;
  hasSeason: boolean;
  isDarkMode: boolean;
  scaleY: number;
}

const MeadowPetalItem: FC<MeadowPetalItemProps> = ({
  petal,
  idx,
  normalizedProgress,
  hasSeason,
  isDarkMode,
  scaleY,
}) => {
  const schedule = SPRING_PETAL_SCHEDULES[idx] ?? {
    bloomIn: 3.5,
    bloomOut: 0.5,
  };
  const petalFactor = hasSeason
    ? getFlowerBloomFactor(
        normalizedProgress,
        schedule.bloomIn,
        schedule.bloomOut,
      )
    : 1;

  if (petalFactor <= 0.01) return null;

  return (
    <g
      transform={`translate(${petal.cx}, ${petal.cy}) scale(1, ${scaleY}) scale(${petalFactor}) rotate(${petal.rot})`}
      opacity={petalFactor * (isDarkMode ? 0.55 : 0.85)}
    >
      <ellipse
        cx={0}
        cy={0}
        rx={petal.rx}
        ry={petal.ry}
        fill="var(--color-season-spring-blossom-petal)"
      />
    </g>
  );
};

interface ScheduledFlowerItemProps {
  flower: (typeof SPRING_MEADOW_FLOWERS)[number];
  idx: number;
  normalizedProgress: number;
  hasSeason: boolean;
  isDarkMode: boolean;
  scaleY: number;
}

const ScheduledFlowerItem: FC<ScheduledFlowerItemProps> = ({
  flower,
  idx,
  normalizedProgress,
  hasSeason,
  isDarkMode,
  scaleY,
}) => {
  const schedule = SPRING_FLOWER_SCHEDULES[idx] ?? {
    bloomIn: 3.5,
    bloomOut: 0.5,
  };
  const flowerFactor = hasSeason
    ? getFlowerBloomFactor(
        normalizedProgress,
        schedule.bloomIn,
        schedule.bloomOut,
      )
    : 1;

  return (
    <MeadowFlowerItem
      flower={flower}
      isDarkMode={isDarkMode}
      scaleY={scaleY}
      bloomFactor={flowerFactor}
    />
  );
};

export const SpringMeadowFlowers: FC<{
  opacity?: number;
  seasonProgress?: number;
  isDarkMode?: boolean;
  scaleY?: number;
}> = ({ opacity = 1, seasonProgress, isDarkMode = false, scaleY = 1 }) => {
  const hasSeason = typeof seasonProgress === "number";
  const normalizedProgress = hasSeason ? ((seasonProgress % 4) + 4) % 4 : 0;

  if (!hasSeason && opacity <= 0.01) return null;

  return (
    <g id="springMeadowFloorFlowers" opacity={hasSeason ? 1 : opacity}>
      {/* Fallen sakura petals scattered across the floor */}
      {SPRING_MEADOW_FALLEN_PETALS.map((petal, idx) => (
        <MeadowPetalItem
          key={`meadow-petal-${petal.cx}-${petal.cy}`}
          petal={petal}
          idx={idx}
          normalizedProgress={normalizedProgress}
          hasSeason={hasSeason}
          isDarkMode={isDarkMode}
          scaleY={scaleY}
        />
      ))}

      {/* Spring Wildflowers blooming across the foreground hill floor */}
      {SPRING_MEADOW_FLOWERS.map((flower, idx) => (
        <ScheduledFlowerItem
          key={`meadow-flower-${flower.cx}-${flower.cy}`}
          flower={flower}
          idx={idx}
          normalizedProgress={normalizedProgress}
          hasSeason={hasSeason}
          isDarkMode={isDarkMode}
          scaleY={scaleY}
        />
      ))}
    </g>
  );
};
