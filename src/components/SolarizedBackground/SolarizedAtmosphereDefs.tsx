import type { FC } from "react";
import { keyframes, styled } from "@mui/material/styles";

const godraysShimmer = keyframes`
  0%, 100% {
    opacity: 0.35;
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  50% {
    opacity: 0.58;
    transform: translate(-50%, -50%) rotate(2.2deg) scale(1.04);
  }
`;

const auroraWaveKeyframes = keyframes`
  0% {
    transform: translateY(0) scaleY(1) rotate(0deg);
    filter: blur(55px) hue-rotate(0deg);
  }
  50% {
    transform: translateY(-24px) scaleY(1.18) rotate(1.5deg);
    filter: blur(65px) hue-rotate(25deg);
  }
  100% {
    transform: translateY(0) scaleY(1) rotate(0deg);
    filter: blur(55px) hue-rotate(0deg);
  }
`;

const auroraDriftKeyframes = keyframes`
  0% {
    transform: translateX(-8%) scaleX(1);
  }
  50% {
    transform: translateX(8%) scaleX(1.12);
  }
  100% {
    transform: translateX(-8%) scaleX(1);
  }
`;

export const GodraysSvg = styled("svg")({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "320vmax",
  height: "320vmax",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  zIndex: -1,
  transformOrigin: "center center",
  animation: `${godraysShimmer} 11s ease-in-out infinite`,
  mixBlendMode: "screen",
});

export const AuroraWrapper = styled("div")({
  position: "absolute",
  top: 0,
  left: "-10%",
  width: "120%",
  height: "55%",
  pointerEvents: "none",
  zIndex: 2,
  overflow: "hidden",
  opacity: 0.78,
  mixBlendMode: "screen",
});

export const AuroraRibbonPrimary = styled("div")({
  position: "absolute",
  top: "5%",
  left: "5%",
  width: "90%",
  height: 220,
  borderRadius: "50%",
  background:
    "radial-gradient(ellipse at 50% 50%, var(--color-solarized-cyan) 0%, var(--color-solarized-blue) 45%, transparent 75%)",
  filter: "blur(60px)",
  animation: `${auroraWaveKeyframes} 14s ease-in-out infinite`,
});

export const AuroraRibbonSecondary = styled("div")({
  position: "absolute",
  top: "15%",
  left: "15%",
  width: "75%",
  height: 180,
  borderRadius: "50%",
  background:
    "radial-gradient(ellipse at 50% 50%, var(--color-solarized-violet) 0%, var(--color-solarized-magenta) 40%, transparent 70%)",
  filter: "blur(65px)",
  animation: `${auroraDriftKeyframes} 18s ease-in-out infinite`,
});

export const AuroraRibbonTertiary = styled("div")({
  position: "absolute",
  top: "8%",
  right: "10%",
  width: "60%",
  height: 160,
  borderRadius: "50%",
  background:
    "radial-gradient(ellipse at 50% 50%, var(--color-solarized-green) 0%, var(--color-solarized-cyan) 50%, transparent 70%)",
  filter: "blur(50px)",
  opacity: 0.65,
  animation: `${auroraWaveKeyframes} 11s ease-in-out infinite reverse`,
});

export const GodraysBeams: FC = () => (
  <GodraysSvg viewBox="-1600 -1600 3200 3200" fill="none" aria-hidden="true">
    <defs>
      <radialGradient
        id="godrayBeamGrad"
        cx="0"
        cy="0"
        r="1600"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0%"
          stopColor="var(--color-celestial-sun-golden-core)"
          stopOpacity="0.75"
        />
        <stop
          offset="20%"
          stopColor="var(--color-celestial-sun-golden-mid)"
          stopOpacity="0.48"
        />
        <stop
          offset="48%"
          stopColor="var(--color-sky-pastel-orange)"
          stopOpacity="0.25"
        />
        <stop
          offset="76%"
          stopColor="var(--color-sky-pastel-pink)"
          stopOpacity="0.1"
        />
        <stop
          offset="100%"
          stopColor="var(--color-sky-pastel-pink)"
          stopOpacity="0"
        />
      </radialGradient>
    </defs>
    {/* Crepuscular Sunbeams radiating outward from sun center (0, 0) */}
    <polygon points="0,0 -1600,520 -1600,760" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 -1600,920 -1200,1600" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 -850,1600 -450,1600" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 -200,1600 350,1600" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 520,1600 1080,1600" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 1200,1600 1600,1250" fill="url(#godrayBeamGrad)" />
    <polygon points="0,0 1600,600 1600,920" fill="url(#godrayBeamGrad)" />
    <polygon
      points="0,0 -1600,180 -1600,380"
      fill="url(#godrayBeamGrad)"
      opacity="0.8"
    />
    <polygon
      points="0,0 -1600,-150 -1600,50"
      fill="url(#godrayBeamGrad)"
      opacity="0.6"
    />
    <polygon
      points="0,0 -1400,-700 -950,-1150"
      fill="url(#godrayBeamGrad)"
      opacity="0.5"
    />
    <polygon
      points="0,0 -400,-1500 200,-1500"
      fill="url(#godrayBeamGrad)"
      opacity="0.5"
    />
    <polygon
      points="0,0 700,-1300 1300,-850"
      fill="url(#godrayBeamGrad)"
      opacity="0.5"
    />
    <polygon
      points="0,0 1600,-350 1600,180"
      fill="url(#godrayBeamGrad)"
      opacity="0.7"
    />
  </GodraysSvg>
);

export const AuroraBorealis: FC = () => (
  <AuroraWrapper aria-hidden="true">
    <AuroraRibbonPrimary />
    <AuroraRibbonSecondary />
    <AuroraRibbonTertiary />
  </AuroraWrapper>
);
