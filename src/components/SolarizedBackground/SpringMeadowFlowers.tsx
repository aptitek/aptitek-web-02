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

export const SpringMeadowFlowers: FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0.01) return null;

  return (
    <g id="springMeadowFloorFlowers" opacity={opacity}>
      {/* Fallen sakura petals scattered across the floor */}
      {SPRING_MEADOW_FALLEN_PETALS.map((petal) => (
        <ellipse
          key={`meadow-petal-${petal.cx}-${petal.cy}`}
          cx={petal.cx}
          cy={petal.cy}
          rx={petal.rx}
          ry={petal.ry}
          transform={`rotate(${petal.rot}, ${petal.cx}, ${petal.cy})`}
          fill="var(--color-season-spring-blossom-petal)"
          opacity="0.85"
        />
      ))}

      {/* Spring Wildflowers blooming across the foreground hill floor */}
      {SPRING_MEADOW_FLOWERS.map((flower) => {
        const isSakura = flower.type === "sakura";
        return (
          <g
            key={`meadow-flower-${flower.cx}-${flower.cy}`}
            transform={`translate(${flower.cx}, ${flower.cy}) scale(${flower.scale}) rotate(${flower.rotation})`}
          >
            <MeadowFlowerSwayGroup>
              {/* Green leaf sepals at flower base */}
              <path
                d="M-5,4 C-9,2 -9,-2 -3,0 Z"
                fill="var(--color-season-spring-grass)"
                opacity="0.88"
              />
              <path
                d="M5,4 C9,2 9,-2 3,0 Z"
                fill="var(--color-season-spring-grass)"
                opacity="0.88"
              />
              {/* 5 Petals */}
              <circle
                cx="0"
                cy="-6"
                r="4.8"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom-petal)"
                    : "rgba(255, 255, 255, 0.96)"
                }
              />
              <circle
                cx="5.8"
                cy="-1.9"
                r="4.8"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom)"
                    : "rgba(255, 255, 255, 0.9)"
                }
              />
              <circle
                cx="3.6"
                cy="4.9"
                r="4.8"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom-deep)"
                    : "rgba(255, 255, 255, 0.96)"
                }
              />
              <circle
                cx="-3.6"
                cy="4.9"
                r="4.8"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom-deep)"
                    : "rgba(255, 255, 255, 0.9)"
                }
              />
              <circle
                cx="-5.8"
                cy="-1.9"
                r="4.8"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom)"
                    : "rgba(255, 255, 255, 0.96)"
                }
              />
              {/* Center Core */}
              <circle
                cx="0"
                cy="0"
                r="2.5"
                fill={
                  isSakura
                    ? "var(--color-season-spring-blossom-core)"
                    : "var(--color-solarized-yellow)"
                }
              />
              <circle
                cx="0"
                cy="0"
                r="1.2"
                fill={
                  isSakura
                    ? "rgba(255, 255, 255, 0.8)"
                    : "var(--color-solarized-orange)"
                }
                opacity="0.7"
              />
            </MeadowFlowerSwayGroup>
          </g>
        );
      })}
    </g>
  );
};
