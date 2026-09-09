import { useEffect, useRef, type RefObject } from "react";
import type {
  MouseState,
  Point2D,
  WindState,
} from "./SolarizedBackground.types";
import { LeafParticle, WindBreezeStream } from "./SolarizedLeafRenderer";

const DEFAULT_STREAM_COUNT = 12;

export interface CanopyMetrics {
  center: Point2D;
  radiusX: number;
  radiusY: number;
}

function getDomCanopyMetrics(
  containerElement: HTMLElement,
): CanopyMetrics | null {
  if (typeof containerElement.getBoundingClientRect !== "function") {
    return null;
  }
  const containerRect = containerElement.getBoundingClientRect();
  const canopyEl = containerElement.querySelector(".tree-swaying-canopy");
  if (canopyEl && typeof canopyEl.getBoundingClientRect === "function") {
    const canopyRect = canopyEl.getBoundingClientRect();
    if (canopyRect.width > 10 && canopyRect.height > 10) {
      return {
        center: {
          x: canopyRect.left - containerRect.left + canopyRect.width * 0.5,
          y: canopyRect.top - containerRect.top + canopyRect.height * 0.5,
        },
        radiusX: canopyRect.width * 0.38,
        radiusY: canopyRect.height * 0.32,
      };
    }
  }

  const treeEl = containerElement.querySelector("#peacefulTreeContainer");
  if (treeEl && typeof treeEl.getBoundingClientRect === "function") {
    const treeRect = treeEl.getBoundingClientRect();
    if (treeRect.width > 10 && treeRect.height > 10) {
      return {
        center: {
          x: treeRect.left - containerRect.left + treeRect.width * 0.49,
          y: treeRect.top - containerRect.top + treeRect.height * 0.3,
        },
        radiusX: treeRect.width * 0.32,
        radiusY: treeRect.height * 0.16,
      };
    }
  }
  return null;
}

function getCssFallbackCanopyMetrics(
  containerWidth: number,
  containerHeight: number,
): CanopyMetrics {
  const isWide = containerWidth >= 900;
  const left = isWide ? containerWidth * 0.01 : containerWidth * -0.06;
  const treeWidth = Math.max(480, Math.min(840, containerWidth * 0.5));
  const treeHeight = Math.max(640, Math.min(1080, containerWidth * 0.68));
  const treeTop = containerHeight - treeHeight;

  return {
    center: {
      x: left + treeWidth * 0.49,
      y: treeTop + treeHeight * 0.3,
    },
    radiusX: treeWidth * 0.32,
    radiusY: treeHeight * 0.16,
  };
}

export function getCanopyMetrics(
  containerWidth: number,
  containerHeight: number,
  containerElement?: HTMLElement | null,
): CanopyMetrics {
  if (containerElement) {
    const domMetrics = getDomCanopyMetrics(containerElement);
    if (domMetrics) return domMetrics;
  }
  return getCssFallbackCanopyMetrics(containerWidth, containerHeight);
}

export function calculateCanopyOrigin(
  containerWidth: number,
  containerHeight: number,
  containerElement?: HTMLElement | null,
): Point2D {
  const metrics = getCanopyMetrics(
    containerWidth,
    containerHeight,
    containerElement,
  );
  const angle = Math.random() * Math.PI * 2;
  const radialRatio = Math.sqrt(Math.random()) * 0.72;
  return {
    x: metrics.center.x + Math.cos(angle) * metrics.radiusX * radialRatio,
    y: metrics.center.y + Math.sin(angle) * metrics.radiusY * radialRatio,
  };
}

export function getCanopyCenter(
  containerWidth: number,
  containerHeight: number,
  containerElement?: HTMLElement | null,
): Point2D {
  return getCanopyMetrics(containerWidth, containerHeight, containerElement)
    .center;
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
  seasonProgress?: number;
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
  seasonProgress: number;
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
    seasonProgress,
  } = options;

  for (const fallingLeaf of leaves) {
    if (!reducedMotion) {
      fallingLeaf.update(windState, mouseState, viewport, canopyOrigin);
    }
    fallingLeaf.draw(renderContext, isDarkMode, seasonProgress);
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
  seasonProgress = 1.0,
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
    let cachedCanopy = getCanopyMetrics(
      canvasWidth,
      canvasHeight,
      parentContainer,
    );
    const initialLeaves: LeafParticle[] = [];
    for (let leafIndex = 0; leafIndex < leafCount; leafIndex++) {
      const origin = calculateCanopyOrigin(
        canvasWidth,
        canvasHeight,
        parentContainer,
      );
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
      cachedCanopy = getCanopyMetrics(
        canvasWidth,
        canvasHeight,
        parentContainer,
      );
    });
    resizeObserver.observe(parentContainer);

    let frameCount = 0;

    function animationTick() {
      if (!renderContext) return;

      const mouseState = mouseStateRef.current;
      const windState = windStateRef.current;
      if (!mouseState || !windState) return;

      frameCount++;
      if (frameCount % 60 === 0) {
        cachedCanopy = getCanopyMetrics(
          canvasWidth,
          canvasHeight,
          parentContainer,
        );
      }

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

      const canopyCenter = cachedCanopy.center;
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

      updateLeavesAndDraw({
        renderContext,
        leaves: leavesRef.current,
        windState,
        mouseState,
        viewport,
        canopyOrigin: canopyCenter,
        isDarkMode,
        reducedMotion: checkReducedMotion,
        seasonProgress,
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
    seasonProgress,
  ]);
}
