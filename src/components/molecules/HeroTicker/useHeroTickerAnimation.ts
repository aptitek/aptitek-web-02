import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { HeroTickerAnimationMode } from "./HeroTicker.types";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduced;
}

export function useTickerState(
  phrases: string[],
  onPhraseChange?: (index: number, phrase: string) => void,
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"drawing" | "paused" | "erasing">(
    "drawing",
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);

  useEffect(() => {
    onPhraseChange?.(currentIndex, phrases[currentIndex] || "");
  }, [currentIndex, phrases, onPhraseChange]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
    setPhase("drawing");
  }, [phrases.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + phrases.length) % phrases.length);
    setPhase("drawing");
  }, [phrases.length]);

  const goToIndex = useCallback(
    (idx: number) => {
      setCurrentIndex(idx % phrases.length);
      setPhase("drawing");
    },
    [phrases.length],
  );

  const onPauseComplete = useCallback(() => setPhase("erasing"), []);
  const onDrawComplete = useCallback(() => setPhase("paused"), []);

  return {
    currentIndex,
    phase,
    isHovered,
    isPausedManually,
    setIsHovered,
    setIsPausedManually,
    goToNext,
    goToPrev,
    goToIndex,
    onPauseComplete,
    onDrawComplete,
  };
}

interface DrawAnimationOptions {
  enabled: boolean;
  phase: "drawing" | "paused" | "erasing";
  drawSpeed: number;
  pauseDuration: number;
  isPaused: boolean;
  onDrawComplete: () => void;
  onPauseComplete: () => void;
  onEraseComplete: () => void;
}

export function useDrawAnimation({
  enabled,
  phase,
  drawSpeed,
  pauseDuration,
  isPaused,
  onDrawComplete,
  onPauseComplete,
  onEraseComplete,
}: DrawAnimationOptions): number {
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === "drawing") {
      let cancelled = false;
      startTimeRef.current = null;

      const step = (timestamp: number) => {
        if (cancelled) return;
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const current = Math.min(100, (elapsed / drawSpeed) * 100);
        setProgress(current);

        if (current < 100) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          onDrawComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
      return () => {
        cancelled = true;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    if (phase === "paused") {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (phase === "erasing") {
      let cancelled = false;
      startTimeRef.current = null;
      const eraseDuration = Math.max(240, drawSpeed * 0.35);

      const step = (timestamp: number) => {
        if (cancelled) return;
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const remaining = Math.max(0, 100 - (elapsed / eraseDuration) * 100);
        setProgress(remaining);

        if (remaining > 0) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          onEraseComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
      return () => {
        cancelled = true;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [
    enabled,
    phase,
    drawSpeed,
    pauseDuration,
    isPaused,
    onDrawComplete,
    onPauseComplete,
    onEraseComplete,
  ]);

  return progress;
}

interface TypeAnimationOptions {
  enabled: boolean;
  phase: "drawing" | "paused" | "erasing";
  phraseLength: number;
  typeSpeed: number;
  eraseSpeed: number;
  pauseDuration: number;
  isPaused: boolean;
  onTypeComplete: () => void;
  onPauseComplete: () => void;
  onEraseComplete: () => void;
}

export function useTypeAnimation({
  enabled,
  phase,
  phraseLength,
  typeSpeed,
  eraseSpeed,
  pauseDuration,
  isPaused,
  onTypeComplete,
  onPauseComplete,
  onEraseComplete,
}: TypeAnimationOptions): number {
  const [charsCount, setCharsCount] = useState(0);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === "drawing") {
      if (charsCount < phraseLength) {
        const timer = setTimeout(() => {
          setCharsCount((prev) => prev + 1);
        }, typeSpeed);
        return () => clearTimeout(timer);
      }
      onTypeComplete();
      return;
    }

    if (phase === "paused") {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (phase === "erasing") {
      if (charsCount > 0) {
        const timer = setTimeout(() => {
          setCharsCount((prev) => prev - 1);
        }, eraseSpeed);
        return () => clearTimeout(timer);
      }
      onEraseComplete();
    }
  }, [
    enabled,
    phase,
    charsCount,
    phraseLength,
    typeSpeed,
    eraseSpeed,
    pauseDuration,
    isPaused,
    onTypeComplete,
    onPauseComplete,
    onEraseComplete,
  ]);

  return charsCount;
}

interface FadeAnimationOptions {
  enabled: boolean;
  phase: "drawing" | "paused" | "erasing";
  pauseDuration: number;
  isPaused: boolean;
  onFadeInComplete: () => void;
  onPauseComplete: () => void;
  onFadeOutComplete: () => void;
}

export function useFadeAnimation({
  enabled,
  phase,
  pauseDuration,
  isPaused,
  onFadeInComplete,
  onPauseComplete,
  onFadeOutComplete,
}: FadeAnimationOptions): number {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!enabled || isPaused) return;

    if (phase === "drawing") {
      setOpacity(1);
      const timer = setTimeout(onFadeInComplete, 350);
      return () => clearTimeout(timer);
    }

    if (phase === "paused") {
      const timer = setTimeout(onPauseComplete, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (phase === "erasing") {
      setOpacity(0);
      const timer = setTimeout(onFadeOutComplete, 300);
      return () => clearTimeout(timer);
    }
  }, [
    enabled,
    phase,
    pauseDuration,
    isPaused,
    onFadeInComplete,
    onPauseComplete,
    onFadeOutComplete,
  ]);

  return opacity;
}

export function useVisibleText(
  mode: HeroTickerAnimationMode,
  phrase: string,
  typedChars: number,
  reducedMotion: boolean,
): string {
  return useMemo(() => {
    if (mode === "cursive-type" && !reducedMotion) {
      return phrase.slice(0, typedChars);
    }
    return phrase;
  }, [mode, phrase, typedChars, reducedMotion]);
}

export function calculateCurrentProgress(
  mode: HeroTickerAnimationMode,
  drawProgress: number,
  typeCharsCount: number,
  phraseLength: number,
): number {
  if (mode === "cursive-draw") return drawProgress;
  if (mode === "cursive-type") {
    return phraseLength > 0 ? (typeCharsCount / phraseLength) * 100 : 0;
  }
  return 100;
}
