/**
 * Quill Letter-Line Trajectory Engine
 *
 * Calculates the exact 2D coordinates (X, Y), slant offset, and tilt angle
 * of the calligraphy quill nib so that it closely tracks the physical cursive
 * letter strokes of the Milkshake script (ascenders, descenders, median loops,
 * and pen-up word transitions).
 */

export interface QuillTrajectoryPoint {
  /** CSS left position expression with horizontal slant correction */
  left: string;
  /** CSS bottom position expression aligning the nib tip to the letter line */
  bottom: string;
  /** Dynamic tilt angle in degrees (-14deg on downstrokes, -4deg on upstrokes, -8deg resting) */
  tiltAngle: number;
  /** Vertical position as a percentage from container bottom (12% descender to 86% ascender) */
  verticalPercent: number;
  /** Whether the quill is currently executing a high-pressure downstroke */
  isDownstroke: boolean;
}

export interface CharInterval {
  char: string;
  start: number;
  end: number;
}

// Measured Milkshake cursive script typography landmarks (% from container bottom)
export const LETTER_METRICS = {
  baseline: 26,
  median: 60,
  ascender: 86,
  descender: 12,
  slantFactor: 13, // 13px forward slant at ascender height relative to baseline
  tipOffsetX: 11, // nib tip is 11px inside the 52px quill asset
  tipOffsetY: 2, // nib tip is 2px above the bottom of the 52px quill asset
} as const;

export function normalizeChar(char: string): string {
  if (!char) return "e";
  return char.normalize("NFD").charAt(0).toLowerCase();
}

export function getCharWidthWeight(char: string): number {
  if (char === " ") return 0.7;
  if (/[MW]/.test(char)) return 1.6;
  if (/[mw]/.test(char)) return 1.4;
  if (/[ijl.,!]/.test(char)) return 0.6;
  if (/[frt]/.test(char)) return 0.8;
  if (/[A-Z]/.test(char)) return 1.3;
  return 1.0;
}

export function buildCharIntervals(phrase: string): CharInterval[] {
  if (!phrase) return [];
  const chars = phrase.split("");
  const weights = chars.map(getCharWidthWeight);
  const total = weights.reduce((acc, w) => acc + w, 0);
  if (total === 0) return [];

  let accumulated = 0;
  return chars.map((char, i) => {
    const start = (accumulated / total) * 100;
    accumulated += weights[i] ?? 1.0;
    const end = (accumulated / total) * 100;
    return { char, start, end };
  });
}

export function findActiveChar(
  intervals: CharInterval[],
  progress: number,
): { char: string; t: number } {
  if (intervals.length === 0) return { char: "e", t: 0.5 };
  const clamped = Math.max(0, Math.min(100, progress));

  for (let i = 0; i < intervals.length; i += 1) {
    const inv = intervals[i];
    if (!inv) continue;
    if (clamped >= inv.start && clamped <= inv.end) {
      const span = inv.end - inv.start;
      const t = span > 0 ? (clamped - inv.start) / span : 0.5;
      return { char: inv.char, t: Math.max(0, Math.min(1, t)) };
    }
  }

  const last = intervals[intervals.length - 1];
  return { char: last?.char || "e", t: 1.0 };
}

function getAscenderStroke(t: number): { y: number; down: boolean } {
  const { baseline, ascender } = LETTER_METRICS;
  if (t < 0.4) {
    const upRatio = t / 0.4;
    const y = 32 + (ascender - 32) * Math.sin(upRatio * (Math.PI / 2));
    return { y, down: false };
  }
  if (t < 0.8) {
    const downRatio = (t - 0.4) / 0.4;
    const y =
      ascender - (ascender - baseline) * Math.sin(downRatio * (Math.PI / 2));
    return { y, down: true };
  }
  const exitRatio = (t - 0.8) / 0.2;
  const y = baseline + 8 * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false };
}

function getDescenderStroke(t: number): { y: number; down: boolean } {
  const { baseline, median, descender } = LETTER_METRICS;
  if (t < 0.45) {
    const bodyRatio = t / 0.45;
    const y = baseline + (median - baseline) * Math.sin(bodyRatio * Math.PI);
    return { y, down: bodyRatio > 0.5 };
  }
  if (t < 0.8) {
    const plungeRatio = (t - 0.45) / 0.35;
    const y =
      baseline - (baseline - descender) * Math.sin(plungeRatio * Math.PI);
    return { y, down: plungeRatio < 0.5 };
  }
  const exitRatio = (t - 0.8) / 0.2;
  const y = baseline + 8 * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false };
}

function getMultiArchStroke(
  char: string,
  t: number,
): { y: number; down: boolean } {
  const { baseline, median } = LETTER_METRICS;
  const arches = char === "m" ? 3 : 2;
  const phase = t * arches * Math.PI;
  const y = baseline + (median - baseline) * Math.abs(Math.sin(phase));
  const slope = Math.cos(phase);
  return { y, down: slope < 0 };
}

function getMedianStroke(t: number): { y: number; down: boolean } {
  const { baseline, median } = LETTER_METRICS;
  if (t < 0.45) {
    const upRatio = t / 0.45;
    const y = 30 + (median - 30) * Math.sin(upRatio * (Math.PI / 2));
    return { y, down: false };
  }
  if (t < 0.8) {
    const downRatio = (t - 0.45) / 0.35;
    const y =
      median - (median - baseline) * Math.sin(downRatio * (Math.PI / 2));
    return { y, down: true };
  }
  const exitRatio = (t - 0.8) / 0.2;
  const y = baseline + 8 * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false };
}

export function getCharacterStroke(
  rawChar: string,
  t: number,
): { y: number; down: boolean } {
  if (rawChar === " ") {
    // Pen lifts smoothly between words
    return { y: 34 + 12 * Math.sin(t * Math.PI), down: false };
  }

  const char = normalizeChar(rawChar);
  const isAscender =
    /[bdfhklt0-9!]/.test(char) || rawChar !== rawChar.toLowerCase();
  if (isAscender) {
    return getAscenderStroke(t);
  }

  const isDescender = /[gjpqyz]/.test(char);
  if (isDescender) {
    return getDescenderStroke(t);
  }

  if (char === "m" || char === "n") {
    return getMultiArchStroke(char, t);
  }

  return getMedianStroke(t);
}

export function calculateSlantOffset(verticalPercent: number): number {
  const { baseline, median, slantFactor } = LETTER_METRICS;
  const range = median - baseline;
  return ((verticalPercent - baseline) / range) * (slantFactor * 0.55);
}

export function calculateQuillTrajectory(
  phrase: string,
  progress: number,
  active: boolean,
): QuillTrajectoryPoint {
  if (!active || progress <= 0) {
    const restingY = LETTER_METRICS.baseline + 6;
    const slantPx = calculateSlantOffset(restingY);
    const leftCalc = `calc(${progress}% - ${LETTER_METRICS.tipOffsetX}px + ${slantPx.toFixed(1)}px)`;
    const bottomCalc = `calc(${restingY.toFixed(1)}% - ${LETTER_METRICS.tipOffsetY}px)`;
    return {
      left: leftCalc,
      bottom: bottomCalc,
      tiltAngle: -8,
      verticalPercent: restingY,
      isDownstroke: false,
    };
  }

  const intervals = buildCharIntervals(phrase);
  const { char, t } = findActiveChar(intervals, progress);
  const { y, down } = getCharacterStroke(char, t);

  const slantPx = calculateSlantOffset(y);
  const tiltAngle = down ? -14 : -4;

  const leftCalc = `calc(${progress}% - ${LETTER_METRICS.tipOffsetX}px + ${slantPx.toFixed(1)}px)`;
  const bottomCalc = `calc(${y.toFixed(1)}% - ${LETTER_METRICS.tipOffsetY}px)`;

  return {
    left: leftCalc,
    bottom: bottomCalc,
    tiltAngle,
    verticalPercent: y,
    isDownstroke: down,
  };
}
