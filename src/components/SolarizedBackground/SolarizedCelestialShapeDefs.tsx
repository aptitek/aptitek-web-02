import type { FC } from "react";
import {
  CelestialContainer,
  MoonCrescentSvg,
  MoonOrb,
  StarDot,
  StarfieldOverlay,
  SunOrb,
} from "./SolarizedBackground.styles";
import { GodraysBeams } from "./SolarizedAtmosphereDefs";

// Deterministic star coordinates to ensure 100% hydration consistency
const STAR_POSITIONS = [
  { id: "star-01", left: "8%", top: "12%", size: 2.2, opacity: 0.8 },
  { id: "star-02", left: "14%", top: "28%", size: 1.6, opacity: 0.6 },
  { id: "star-03", left: "22%", top: "8%", size: 2.4, opacity: 0.85 },
  { id: "star-04", left: "28%", top: "34%", size: 1.4, opacity: 0.5 },
  { id: "star-05", left: "35%", top: "18%", size: 2.0, opacity: 0.7 },
  { id: "star-06", left: "42%", top: "6%", size: 2.5, opacity: 0.9 },
  { id: "star-07", left: "48%", top: "26%", size: 1.5, opacity: 0.6 },
  { id: "star-08", left: "55%", top: "14%", size: 2.2, opacity: 0.8 },
  { id: "star-09", left: "62%", top: "38%", size: 1.8, opacity: 0.65 },
  { id: "star-10", left: "68%", top: "9%", size: 2.6, opacity: 0.85 },
  { id: "star-11", left: "75%", top: "22%", size: 1.6, opacity: 0.7 },
  { id: "star-12", left: "82%", top: "7%", size: 2.4, opacity: 0.9 },
  { id: "star-13", left: "88%", top: "32%", size: 1.5, opacity: 0.55 },
  { id: "star-14", left: "94%", top: "16%", size: 2.0, opacity: 0.75 },
  { id: "star-15", left: "11%", top: "45%", size: 1.4, opacity: 0.5 },
  { id: "star-16", left: "26%", top: "48%", size: 2.1, opacity: 0.7 },
  { id: "star-17", left: "52%", top: "44%", size: 1.7, opacity: 0.6 },
  { id: "star-18", left: "72%", top: "46%", size: 2.2, opacity: 0.75 },
  { id: "star-19", left: "86%", top: "42%", size: 1.8, opacity: 0.65 },
];

export interface CelestialProps {
  isDarkMode?: boolean;
  showGodrays?: boolean;
  parallaxX?: number;
  parallaxY?: number;
}

export const Starfield: FC = () => (
  <StarfieldOverlay aria-hidden="true">
    {STAR_POSITIONS.map((star) => (
      <StarDot
        key={star.id}
        sx={{
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
          opacity: star.opacity,
        }}
      />
    ))}
  </StarfieldOverlay>
);

export const CelestialBody: FC<CelestialProps> = ({
  isDarkMode = false,
  showGodrays = true,
}) => {
  return (
    <CelestialContainer id="celestialBodyContainer" aria-hidden="true">
      {isDarkMode ? (
        <MoonOrb>
          <MoonCrescentSvg viewBox="0 0 100 100">
            <defs>
              <linearGradient
                id="moonGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-solarized-base3)" />
                <stop offset="65%" stopColor="var(--color-solarized-base1)" />
                <stop offset="100%" stopColor="var(--color-solarized-cyan)" />
              </linearGradient>
              <mask id="crescentMoonMask">
                <circle cx="50" cy="50" r="42" fill="white" />
                <circle cx="68" cy="40" r="36" fill="black" />
              </mask>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="url(#moonGradient)"
              mask="url(#crescentMoonMask)"
            />
          </MoonCrescentSvg>
        </MoonOrb>
      ) : (
        <>
          {showGodrays && <GodraysBeams />}
          <SunOrb />
        </>
      )}
    </CelestialContainer>
  );
};
