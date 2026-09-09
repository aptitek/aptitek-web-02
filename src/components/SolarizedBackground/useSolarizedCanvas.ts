import { useEffect, useRef, type RefObject } from "react";
import type {
  MouseState,
  Point2D,
  WindState,
} from "./SolarizedBackground.types";
import { LeafParticle, WindBreezeStream } from "./SolarizedLeafRenderer";

const DEFAULT_STREAM_COUNT = 12;

export function calculateCanopyOrigin(
  containerWidth: number,
  containerHeight: number,
): Point2D {
  return {
    x: containerWidth * (0.16 + Math.random() * 0.14),
    y: containerHeight * (0.34 + Math.random() * 0.16),
  };
}

export function getCanopyCenter(
  containerWidth: number,
  containerHeight: number,
): Point2D {
  return {
    x: containerWidth * 0.22,
    y: containerHeight * 0.42,
  };
}

export interface ComputeWindVectorOptions {
  mouseState: MouseState;
  origin: Point2D;
  windIntensity: number;
}

export function computeTargetWindVector(
  options: ComputeWindVectorOptions,
): Point2D {
  const { mouseState, origin, windIntensity } = options;
  const deltaX = mouseState.x - origin.x;
  const baseBreezeSpeed = 0.85 * (windIntensity || 1.0);

  // Breeze moves strictly horizontally — no vertical wind component
  const directionX = deltaX >= 0 ? 1 : -1;
  const distanceRatio = Math.min(
    1.25,
    Math.max(0.6, Math.abs(deltaX) / (origin.x || 200)),
  );
  const speedX = directionX * distanceRatio * baseBreezeSpeed;

  return {
    x: speedX,
    y: 0,
  };
}

export interface UseSolarizedCanvasOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  leafCount: number;
  windIntensity: number;
  isDarkMode: boolean;
  mouseStateRef: RefObject<MouseState>;
  windStateRef: RefObject<WindState>;
}

interface StreamsDrawOptions {
  renderContext: CanvasRenderingContext2D;
  streams: WindBreezeStream[];
  windState: WindState;
  viewport: Point2D;
  isDarkMode: boolean;
  reducedMotion: boolean;
}

interface LeavesDrawOptions {
  renderContext: CanvasRenderingContext2D;
  leaves: LeafParticle[];
  windState: WindState;
  mouseState: MouseState;
  viewport: Point2D;
  canopyOrigin: Point2D;
  isDarkMode: boolean;
  reducedMotion: boolean;
}

function updateStreamsAndDraw(options: StreamsDrawOptions): void {
  const {
    renderContext,
    streams,
    windState,
    viewport,
    isDarkMode,
    reducedMotion,
  } = options;

  for (const breezeStream of streams) {
    if (!reducedMotion) {
      breezeStream.update(windState, viewport.x, viewport.y);
    }
    breezeStream.draw(renderContext, isDarkMode);
  }
}

function updateLeavesAndDraw(options: LeavesDrawOptions): void {
  const {
    renderContext,
    leaves,
    windState,
    mouseState,
    viewport,
    canopyOrigin,
    isDarkMode,
    reducedMotion,
  } = options;

  for (const fallingLeaf of leaves) {
    if (!reducedMotion) {
      fallingLeaf.update(windState, mouseState, viewport, canopyOrigin);
    }
    fallingLeaf.draw(renderContext, isDarkMode);
  }
}

export function useSolarizedCanvas({
  canvasRef,
  containerRef,
  leafCount,
  windIntensity,
  isDarkMode,
  mouseStateRef,
  windStateRef,
}: UseSolarizedCanvasOptions): void {
  const leavesRef = useRef<LeafParticle[]>([]);
  const streamsRef = useRef<WindBreezeStream[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const parentContainer = containerRef.current;
    if (!canvasElement || !parentContainer) return;

    const renderContext = canvasElement.getContext("2d");
    if (!renderContext) return;

    let canvasWidth = (canvasElement.width =
      parentContainer.clientWidth || 800);
    let canvasHeight = (canvasElement.height =
      parentContainer.clientHeight || 600);

    const checkReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize leaves
    const initialLeaves: LeafParticle[] = [];
    for (let leafIndex = 0; leafIndex < leafCount; leafIndex++) {
      const origin = calculateCanopyOrigin(canvasWidth, canvasHeight);
      initialLeaves.push(
        new LeafParticle(true, canvasWidth, canvasHeight, origin),
      );
    }
    leavesRef.current = initialLeaves;

    // Initialize breeze streams
    const initialStreams: WindBreezeStream[] = [];
    for (
      let streamIndex = 0;
      streamIndex < DEFAULT_STREAM_COUNT;
      streamIndex++
    ) {
      initialStreams.push(
        new WindBreezeStream(
          canvasWidth,
          canvasHeight,
          windStateRef.current ?? undefined,
          true,
        ),
      );
    }
    streamsRef.current = initialStreams;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      canvasWidth = canvasElement.width = entry.contentRect.width;
      canvasHeight = canvasElement.height = entry.contentRect.height;
    });
    resizeObserver.observe(parentContainer);

    function animationTick() {
      if (!renderContext) return;

      const mouseState = mouseStateRef.current;
      const windState = windStateRef.current;
      if (!mouseState || !windState) return;

      const previousTargetX = mouseState.x;
      const previousTargetY = mouseState.y;

      mouseState.x += (mouseState.targetX - mouseState.x) * 0.08;
      mouseState.y += (mouseState.targetY - mouseState.y) * 0.08;

      const cursorMovement = Math.hypot(
        mouseState.x - previousTargetX,
        mouseState.y - previousTargetY,
      );
      if (cursorMovement > 1.2) {
        windState.gustBoost = Math.min(
          0.35,
          windState.gustBoost + cursorMovement * 0.012,
        );
      }

      if (windState.gustBoost > 0) {
        windState.gustBoost =
          windState.gustBoost * 0.96 < 0.01 ? 0 : windState.gustBoost * 0.96;
      }

      const canopyCenter = getCanopyCenter(canvasWidth, canvasHeight);
      const targetWind = computeTargetWindVector({
        mouseState,
        origin: canopyCenter,
        windIntensity,
      });

      windState.currentX += (targetWind.x - windState.currentX) * 0.035;
      windState.currentY = 0;

      renderContext.clearRect(0, 0, canvasWidth, canvasHeight);

      const viewport: Point2D = { x: canvasWidth, y: canvasHeight };

      updateStreamsAndDraw({
        renderContext,
        streams: streamsRef.current,
        windState,
        viewport,
        isDarkMode,
        reducedMotion: checkReducedMotion,
      });

      const canopyOrigin = calculateCanopyOrigin(canvasWidth, canvasHeight);

      updateLeavesAndDraw({
        renderContext,
        leaves: leavesRef.current,
        windState,
        mouseState,
        viewport,
        canopyOrigin,
        isDarkMode,
        reducedMotion: checkReducedMotion,
      });

      animationFrameIdRef.current = requestAnimationFrame(animationTick);
    }

    animationFrameIdRef.current = requestAnimationFrame(animationTick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [
    canvasRef,
    containerRef,
    leafCount,
    windIntensity,
    isDarkMode,
    mouseStateRef,
    windStateRef,
  ]);
}
