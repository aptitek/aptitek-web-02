import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useThemeMode } from "~/utils/themeContext";
import type {
  MouseState,
  Point2D,
  SolarizedBackgroundProps,
  SolarizedThemeMode,
  WindState,
} from "./SolarizedBackground.types";
import {
  AmbientGlowOrb,
  BackgroundRoot,
  ContentWrapper,
  InteractiveCanvas,
  SkyBackdrop,
} from "./SolarizedBackground.styles";
import {
  LandscapeClouds,
  LandscapeHills,
  PeacefulTreeGraphic,
} from "./SolarizedLandscapeShapeDefs";
import { CelestialBody, Starfield } from "./SolarizedCelestialShapeDefs";
import { AuroraBorealis } from "./SolarizedAtmosphereDefs";
import { ForegroundGrassBlades } from "./SolarizedGrassDefs";
import { useSolarizedCanvas } from "./useSolarizedCanvas";
import { resolveSeasonProgress } from "./seasonUtils";

const DEFAULT_LEAF_COUNT = 44;

function resolveIsDark(
  modeOption?: SolarizedThemeMode,
  contextMode?: string,
): boolean {
  if (modeOption === "dark") return true;
  if (modeOption === "light" || modeOption === "sunset") return false;
  return contextMode === "dark" || contextMode === "debug";
}

interface ResolvedConfig {
  interactive: boolean;
  showTree: boolean;
  showHills: boolean;
  showCelestial: boolean;
  showClouds: boolean;
  showGodrays: boolean;
  showAurora: boolean;
  showGrass: boolean;
  leafCount: number;
  windIntensity: number;
  season?: SolarizedBackgroundProps["season"];
  seasonProgress?: number;
}

const DEFAULT_CONFIG: ResolvedConfig = {
  interactive: true,
  showTree: true,
  showHills: true,
  showCelestial: true,
  showClouds: true,
  showGodrays: true,
  showAurora: true,
  showGrass: true,
  leafCount: DEFAULT_LEAF_COUNT,
  windIntensity: 1.0,
  season: "summer",
  seasonProgress: undefined,
};

function resolveBackgroundConfig(
  props: SolarizedBackgroundProps,
): ResolvedConfig {
  return {
    ...DEFAULT_CONFIG,
    ...props,
  };
}

const AtmosphereLayerGroup: FC<{
  showAurora: boolean;
  isDarkMode: boolean;
}> = ({ showAurora, isDarkMode }) => {
  if (isDarkMode && showAurora) {
    return <AuroraBorealis />;
  }
  return null;
};

const LandscapeLayerGroup: FC<{
  showHills: boolean;
  showClouds: boolean;
  showTree: boolean;
  isDarkMode: boolean;
  parallax: Point2D;
  seasonProgress: number;
  meadowScaleY?: number;
}> = ({
  showHills,
  showClouds,
  showTree,
  isDarkMode,
  parallax,
  seasonProgress,
  meadowScaleY = 1,
}) => (
  <>
    {showClouds && <LandscapeClouds />}
    {showHills && (
      <LandscapeHills
        seasonProgress={seasonProgress}
        isDarkMode={isDarkMode}
        meadowScaleY={meadowScaleY}
      />
    )}
    {showTree && (
      <PeacefulTreeGraphic
        isDarkMode={isDarkMode}
        seasonProgress={seasonProgress}
        parallaxX={parallax.x}
        parallaxY={parallax.y}
      />
    )}
  </>
);

const CelestialLayerGroup: FC<{
  showCelestial: boolean;
  showGodrays: boolean;
  isDarkMode: boolean;
}> = ({ showCelestial, showGodrays, isDarkMode }) => {
  if (!showCelestial) return null;

  return (
    <>
      <CelestialBody isDarkMode={isDarkMode} showGodrays={showGodrays} />
      {isDarkMode && <Starfield />}
    </>
  );
};

export const SolarizedBackground: FC<SolarizedBackgroundProps> = (props) => {
  const { children, className, sx, mode } = props;
  const config = resolveBackgroundConfig(props);

  const { mode: contextMode } = useThemeMode();
  const isDarkMode = resolveIsDark(mode, contextMode);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [parallaxOffset, setParallaxOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [aspectCorrection, setAspectCorrection] = useState({
    meadowScaleY: 1,
    grassScaleY: 1,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateAspect = () => {
      const w = container.clientWidth || 1440;
      const h = container.clientHeight || 900;
      const meadowScaleY = Math.max(
        0.1,
        Math.min(4, w / (1.6 * Math.max(1, h))),
      );
      const grassScaleY = Math.max(0.1, Math.min(4, w / 1440));

      setAspectCorrection((prev) => {
        if (
          Math.abs(prev.meadowScaleY - meadowScaleY) < 0.001 &&
          Math.abs(prev.grassScaleY - grassScaleY) < 0.001
        ) {
          return prev;
        }
        return { meadowScaleY, grassScaleY };
      });
    };

    updateAspect();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateAspect);
      observer.observe(container);
      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener("resize", updateAspect);
    return () => {
      window.removeEventListener("resize", updateAspect);
    };
  }, []);

  const mouseStateRef = useRef<MouseState>({
    x: 400,
    y: 300,
    targetX: 400,
    targetY: 300,
    speedX: 0,
    speedY: 0,
  });

  const windStateRef = useRef<WindState>({
    baseSpeedX: 0.85 * config.windIntensity,
    baseSpeedY: 0,
    currentX: 0.85 * config.windIntensity,
    currentY: 0,
    gustBoost: 0,
  });

  const seasonProgress = resolveSeasonProgress(
    config.season,
    config.seasonProgress,
  );

  useSolarizedCanvas({
    canvasRef,
    containerRef,
    leafCount: config.leafCount,
    windIntensity: config.windIntensity,
    isDarkMode,
    mouseStateRef,
    windStateRef,
    seasonProgress,
  });

  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const boundingBox = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - boundingBox.left;
      const relativeY = clientY - boundingBox.top;

      mouseStateRef.current.targetX = relativeX;
      mouseStateRef.current.targetY = relativeY;

      const halfWidth = boundingBox.width * 0.5;
      const halfHeight = boundingBox.height * 0.5;

      setParallaxOffset({
        x: (relativeX - halfWidth) * 0.015,
        y: (relativeY - halfHeight) * 0.015,
      });
    },
    [],
  );

  useEffect(() => {
    if (!config.interactive) return;

    const handleWindowMouseMove = (event: MouseEvent) => {
      updatePointerPosition(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleWindowMouseMove, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, [config.interactive, updatePointerPosition]);

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!config.interactive) return;
      updatePointerPosition(event.clientX, event.clientY);
    },
    [config.interactive, updatePointerPosition],
  );

  return (
    <BackgroundRoot
      ref={containerRef}
      className={className}
      data-mode={isDarkMode ? "dark" : "light"}
      onMouseMove={handleMouseMove}
      sx={sx}
    >
      <SkyBackdrop />
      <AmbientGlowOrb />

      <AtmosphereLayerGroup
        showAurora={config.showAurora}
        isDarkMode={isDarkMode}
      />

      <CelestialLayerGroup
        showCelestial={config.showCelestial}
        showGodrays={config.showGodrays}
        isDarkMode={isDarkMode}
      />

      <InteractiveCanvas ref={canvasRef} />

      <LandscapeLayerGroup
        showHills={config.showHills}
        showClouds={config.showClouds}
        showTree={config.showTree}
        isDarkMode={isDarkMode}
        parallax={parallaxOffset}
        seasonProgress={seasonProgress}
        meadowScaleY={aspectCorrection.meadowScaleY}
      />

      {config.showGrass && (
        <ForegroundGrassBlades
          isDarkMode={isDarkMode}
          seasonProgress={seasonProgress}
          scaleY={aspectCorrection.grassScaleY}
        />
      )}

      {children && <ContentWrapper>{children}</ContentWrapper>}
    </BackgroundRoot>
  );
};

export default SolarizedBackground;
