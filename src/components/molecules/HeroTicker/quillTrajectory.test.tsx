import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroTickerNib } from "./HeroTickerNib";
import {
  LETTER_METRICS,
  normalizeChar,
  getCharWidthWeight,
  buildCharIntervals,
  findActiveChar,
  getCharacterStroke,
  calculateSlantOffset,
  calculateQuillTrajectory,
} from "./quillTrajectory";

describe("quillTrajectory", () => {
  describe("normalizeChar", () => {
    it("normalizes accented and uppercase characters", () => {
      expect(normalizeChar("é")).toBe("e");
      expect(normalizeChar("À")).toBe("a");
      expect(normalizeChar("ç")).toBe("c");
      expect(normalizeChar("L")).toBe("l");
      expect(normalizeChar("")).toBe("e");
    });
  });

  describe("getCharWidthWeight", () => {
    it("assigns appropriate typographic weights", () => {
      expect(getCharWidthWeight("m")).toBeGreaterThan(getCharWidthWeight("a"));
      expect(getCharWidthWeight("i")).toBeLessThan(getCharWidthWeight("a"));
      expect(getCharWidthWeight(" ")).toBeLessThan(getCharWidthWeight("a"));
      expect(getCharWidthWeight("W")).toBeGreaterThan(getCharWidthWeight("w"));
    });
  });

  describe("buildCharIntervals", () => {
    it("returns empty array for empty phrase", () => {
      expect(buildCharIntervals("")).toEqual([]);
    });

    it("generates contiguous intervals summing to 100%", () => {
      const intervals = buildCharIntervals("test phrase");
      expect(intervals).toHaveLength("test phrase".length);
      expect(intervals[0]?.start).toBe(0);
      expect(intervals[intervals.length - 1]?.end).toBeCloseTo(100, 1);

      for (let i = 1; i < intervals.length; i += 1) {
        expect(intervals[i]?.start).toBeCloseTo(intervals[i - 1]?.end ?? 0, 4);
      }
    });
  });

  describe("findActiveChar", () => {
    it("handles edge cases and clamped progress", () => {
      expect(findActiveChar([], 50)).toEqual({ char: "e", t: 0.5 });

      const intervals = buildCharIntervals("abc");
      const atZero = findActiveChar(intervals, -10);
      expect(atZero.char).toBe("a");
      expect(atZero.t).toBe(0);

      const atEnd = findActiveChar(intervals, 110);
      expect(atEnd.char).toBe("c");
      expect(atEnd.t).toBe(1.0);
    });
  });

  describe("getCharacterStroke", () => {
    it("tracks ascender letters with high vertical peaks", () => {
      const peak = getCharacterStroke("l", 0.35);
      expect(peak.y).toBeCloseTo(LETTER_METRICS.ascender, -1);
      expect(peak.down).toBe(false);

      const downstroke = getCharacterStroke("l", 0.6);
      expect(downstroke.down).toBe(true);
      expect(downstroke.y).toBeLessThan(LETTER_METRICS.ascender);
      expect(downstroke.y).toBeGreaterThan(LETTER_METRICS.baseline);
    });

    it("tracks descender letters dipping below baseline", () => {
      const dip = getCharacterStroke("g", 0.65);
      expect(dip.y).toBeLessThan(LETTER_METRICS.baseline);
      expect(dip.y).toBeGreaterThanOrEqual(LETTER_METRICS.descender);

      const exit = getCharacterStroke("g", 0.95);
      expect(exit.y).toBeGreaterThanOrEqual(LETTER_METRICS.baseline);
      expect(exit.down).toBe(false);
    });

    it("tracks median letters staying near x-height and baseline", () => {
      const peak = getCharacterStroke("e", 0.45);
      expect(peak.y).toBeCloseTo(LETTER_METRICS.median, 0);

      const baselinePass = getCharacterStroke("e", 0.8);
      expect(baselinePass.y).toBeCloseTo(LETTER_METRICS.baseline, 0);
    });

    it("tracks multi-arch letters (m, n)", () => {
      const mStart = getCharacterStroke("m", 0.15);
      expect(mStart.y).toBeGreaterThan(LETTER_METRICS.baseline);
      expect(mStart.y).toBeLessThanOrEqual(LETTER_METRICS.median);
    });

    it("handles space with gentle pen-up lift", () => {
      const spaceLift = getCharacterStroke(" ", 0.5);
      expect(spaceLift.y).toBeGreaterThan(LETTER_METRICS.baseline + 10);
      expect(spaceLift.down).toBe(false);
    });
  });

  describe("calculateSlantOffset", () => {
    it("shifts forward for higher strokes and backward for descenders", () => {
      const ascenderSlant = calculateSlantOffset(LETTER_METRICS.ascender);
      const baselineSlant = calculateSlantOffset(LETTER_METRICS.baseline);
      const descenderSlant = calculateSlantOffset(LETTER_METRICS.descender);

      expect(ascenderSlant).toBeGreaterThan(0);
      expect(baselineSlant).toBeCloseTo(0, 5);
      expect(descenderSlant).toBeLessThan(0);
    });
  });

  describe("calculateQuillTrajectory", () => {
    it("returns resting coordinates when inactive or at zero progress", () => {
      const resting = calculateQuillTrajectory("fluid interactions", 0, false);
      expect(resting.tiltAngle).toBe(-8);
      expect(resting.isDownstroke).toBe(false);
      expect(resting.verticalPercent).toBe(LETTER_METRICS.baseline + 6);
    });

    it("calculates active coordinates with CSS left and bottom expressions", () => {
      const activePoint = calculateQuillTrajectory(
        "elegant software",
        45,
        true,
      );
      expect(activePoint.left).toContain("45%");
      expect(activePoint.bottom).toContain("%");
      expect(activePoint.tiltAngle).toBeLessThan(0);
      expect(typeof activePoint.verticalPercent).toBe("number");
      expect(typeof activePoint.isDownstroke).toBe("boolean");
    });
  });

  describe("HeroTickerNib Component Integration", () => {
    it("renders quill nib positioned according to letter line trajectory", () => {
      render(
        <HeroTickerNib
          progress={50}
          phrase="elegant software"
          active={true}
          data-testid="test-quill-nib"
        />,
      );
      const nib = screen.getByTestId("test-quill-nib");
      expect(nib).toBeDefined();
      expect(nib.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
