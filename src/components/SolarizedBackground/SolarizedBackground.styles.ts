import { styled, keyframes } from "@mui/material/styles";
import { M3_SPACINGS } from "~/tokens/spacing";

const gentleSwayKeyframes = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1.8deg) translateY(-2px);
  }
`;

const coronaPulseKeyframes = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.16);
    opacity: 0.85;
  }
`;

const cloudDriftKeyframes = keyframes`
  0% {
    transform: translateX(-4%);
  }
  50% {
    transform: translateX(4%);
  }
  100% {
    transform: translateX(-4%);
  }
`;

export const BackgroundRoot = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  minHeight: "100%",
  overflow: "hidden",
  isolation: "isolate",
  backgroundColor: "var(--color-solarized-base3)",
  color: "var(--color-solarized-base00)",
  '&[data-mode="dark"], &.dark-mode': {
    backgroundColor: "var(--color-solarized-base03)",
    color: "var(--color-solarized-base0)",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "var(--color-solarized-base03)",
    color: "var(--color-solarized-base0)",
  }),
}));

export const SkyBackdrop = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
  pointerEvents: "none",
  background:
    "linear-gradient(180deg, var(--color-sky-zenith) 0%, var(--color-sky-pastel-pink) 24%, var(--color-sky-pastel-orange) 52%, var(--color-sky-pastel-yellow) 80%, var(--color-sky-horizon) 100%)",
  transition: "background 0.8s ease",
  '[data-mode="dark"] &, [data-theme="dark"] &': {
    background:
      "linear-gradient(180deg, var(--color-solarized-base03) 0%, var(--color-solarized-base02) 65%, var(--color-solarized-base01) 180%)",
  },
  ...theme.applyStyles("dark", {
    background:
      "linear-gradient(180deg, var(--color-solarized-base03) 0%, var(--color-solarized-base02) 65%, var(--color-solarized-base01) 180%)",
  }),
}));

export const AmbientGlowOrb = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "6%",
  right: "12%",
  width: 520,
  height: 520,
  borderRadius: 9999,
  filter: "blur(90px)",
  pointerEvents: "none",
  zIndex: 2,
  background: "rgba(255, 255, 255, 0.22)",
  transition: "background 0.8s ease",
  '[data-mode="dark"] &, [data-theme="dark"] &': {
    background: "rgba(42, 161, 152, 0.22)",
  },
  ...theme.applyStyles("dark", {
    background: "rgba(42, 161, 152, 0.22)",
  }),
}));

export const CelestialContainer = styled("div")({
  position: "absolute",
  top: "14%",
  right: "18%",
  width: 120,
  height: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: 2,
  transform: "none",
});

export const SunOrb = styled("div")({
  position: "relative",
  width: 96,
  height: 96,
  borderRadius: 9999,
  backgroundColor: "var(--color-celestial-sun-golden-mid)",
  background:
    "radial-gradient(circle at center, var(--color-celestial-sun-golden-core) 0%, var(--color-celestial-sun-golden-mid) 58%, var(--color-celestial-sun-golden-rim) 100%)",
  boxShadow:
    "0 0 0 2.5px rgba(255, 255, 255, 0.55), 0 0 24px 6px var(--color-celestial-sun-golden-mid), 0 0 60px 18px var(--color-celestial-sun-golden-aura)",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: -14,
    borderRadius: 9999,
    background:
      "radial-gradient(circle, var(--color-celestial-sun-golden-mid) 0%, transparent 72%)",
    opacity: 0.35,
    animation: `${coronaPulseKeyframes} 3.6s ease-in-out infinite`,
  },
});

export const MoonOrb = styled("div")({
  position: "relative",
  width: 96,
  height: 96,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: "drop-shadow(0 0 24px rgba(42, 161, 152, 0.45))",
});

export const MoonCrescentSvg = styled("svg")({
  width: "100%",
  height: "100%",
  display: "block",
});

export const StarfieldOverlay = styled("div")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 2,
  pointerEvents: "none",
});

export const StarDot = styled("div")({
  position: "absolute",
  borderRadius: 9999,
  backgroundColor: "var(--color-solarized-base2)",
});

export const CloudsSvg = styled("svg")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: 380,
  zIndex: 2,
  pointerEvents: "none",
  animation: `${cloudDriftKeyframes} 24s ease-in-out infinite`,
});

export const HillsSvg = styled("svg")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 3,
  pointerEvents: "none",
  "& .hill-back-path": {
    opacity: 0.72,
    transition: "fill 0.8s ease",
  },
  "& .hill-mid-path": {
    opacity: 0.45,
    transition: "fill 0.8s ease",
  },
  "& .hill-front-path": {
    opacity: 0.88,
    transition: "fill 0.8s ease",
  },
});

export const TreeWrapper = styled("div")({
  position: "absolute",
  left: "-6%",
  bottom: M3_SPACINGS.none,
  width: "clamp(480px, 50vw, 840px)",
  height: "clamp(640px, 68vw, 1080px)",
  zIndex: 5,
  pointerEvents: "none",
  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  "@media (min-width: 900px)": {
    left: "1%",
    bottom: M3_SPACINGS.none,
  },
});

export const TreeSvg = styled("svg")({
  width: "100%",
  height: "100%",
  display: "block",
  overflow: "visible",
  filter: "drop-shadow(0 22px 28px rgba(0, 0, 0, 0.2))",
  "& .tree-swaying-canopy": {
    transformOrigin: "bottom center",
    animation: `${gentleSwayKeyframes} 8s ease-in-out infinite`,
  },
});

export const InteractiveCanvas = styled("canvas")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 4,
  pointerEvents: "none",
});

export const ContentWrapper = styled("div")({
  position: "relative",
  zIndex: 10,
  width: "100%",
  height: "100%",
});
