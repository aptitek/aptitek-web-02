import {
  BOTANICAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from "~/tokens/theme";
import type {
  LeafColors,
  MouseState,
  Point2D,
  WindState,
} from "./SolarizedBackground.types";
import { getSeasonalLeafPalette } from "./seasonUtils";

export const LIGHT_LEAF_PALETTE: LeafColors = {
  vein: BOTANICAL_COLORS.leafVeinDark,
  leftTop: PROGRESS_THEME_COLORS.yellow,
  leftMid: PROGRESS_THEME_COLORS.orange,
  leftBottom: PROGRESS_THEME_COLORS.red,
  rightTop: PROGRESS_THEME_COLORS.green,
  rightMid: BOTANICAL_COLORS.grassBladeHighlight,
  rightBottom: PROGRESS_THEME_COLORS.darkContrast,
};

export const DARK_LEAF_PALETTE: LeafColors = {
  vein: "rgba(42, 161, 152, 0.9)",
  leftTop: PROGRESS_THEME_COLORS.cyan,
  leftMid: PROGRESS_THEME_COLORS.blue,
  leftBottom: PROGRESS_THEME_COLORS.purple,
  rightTop: PROGRESS_THEME_COLORS.green,
  rightMid: PROGRESS_THEME_COLORS.cyan,
  rightBottom: PROGRESS_THEME_COLORS.darkContrast,
};

function renderLeftSegments(
  context: CanvasRenderingContext2D,
  palette: LeafColors,
): void {
  // Left bottom segment
  context.fillStyle = palette.leftBottom;
  context.beginPath();
  context.moveTo(0, 0.7);
  context.bezierCurveTo(-0.35, 0.55, -0.55, 0.35, -0.58, 0.15);
  context.lineTo(0, 0.3);
  context.closePath();
  context.fill();

  // Left mid segment
  context.fillStyle = palette.leftMid;
  context.beginPath();
  context.moveTo(0, 0.3);
  context.lineTo(-0.58, 0.15);
  context.bezierCurveTo(-0.62, -0.15, -0.55, -0.35, -0.48, -0.5);
  context.lineTo(0, -0.2);
  context.closePath();
  context.fill();

  // Left top segment
  context.fillStyle = palette.leftTop;
  context.beginPath();
  context.moveTo(0, -0.2);
  context.lineTo(-0.48, -0.5);
  context.bezierCurveTo(-0.4, -0.85, -0.22, -1.15, 0, -1.35);
  context.closePath();
  context.fill();
}

function renderRightSegments(
  context: CanvasRenderingContext2D,
  palette: LeafColors,
): void {
  // Right bottom segment
  context.fillStyle = palette.rightBottom;
  context.beginPath();
  context.moveTo(0, 0.7);
  context.bezierCurveTo(0.35, 0.55, 0.55, 0.35, 0.58, 0.18);
  context.lineTo(0, 0.35);
  context.closePath();
  context.fill();

  // Right mid segment
  context.fillStyle = palette.rightMid;
  context.beginPath();
  context.moveTo(0, 0.35);
  context.lineTo(0.58, 0.18);
  context.bezierCurveTo(0.62, -0.12, 0.52, -0.35, 0.44, -0.48);
  context.lineTo(0, -0.15);
  context.closePath();
  context.fill();

  // Right top segment
  context.fillStyle = palette.rightTop;
  context.beginPath();
  context.moveTo(0, -0.15);
  context.lineTo(0.44, -0.48);
  context.bezierCurveTo(0.38, -0.85, 0.22, -1.15, 0, -1.35);
  context.closePath();
  context.fill();
}

function renderVeinsAndStem(
  context: CanvasRenderingContext2D,
  palette: LeafColors,
): void {
  context.strokeStyle = palette.vein;
  context.lineWidth = 0.11;
  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();
  // Stem base curving into trunk
  context.moveTo(-0.14, 1.15);
  context.quadraticCurveTo(-0.06, 0.85, 0, 0.7);
  // Main spine running through apex
  context.lineTo(0, -1.35);

  // Left lateral veins
  context.moveTo(0, 0.3);
  context.lineTo(-0.55, 0.15);
  context.moveTo(0, -0.2);
  context.lineTo(-0.46, -0.48);

  // Right lateral veins
  context.moveTo(0, 0.35);
  context.lineTo(0.55, 0.18);
  context.moveTo(0, -0.15);
  context.lineTo(0.42, -0.46);

  context.stroke();
}

function renderCherryPetal(
  context: CanvasRenderingContext2D,
  isDarkMode: boolean,
): void {
  context.fillStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.spring.blossom
    : SEASON_COLORS.spring.blossom;
  context.beginPath();
  context.moveTo(0, 0.9);
  context.bezierCurveTo(-0.6, 0.6, -0.7, -0.4, -0.3, -0.9);
  context.quadraticCurveTo(-0.1, -0.75, 0, -0.6);
  context.quadraticCurveTo(0.1, -0.75, 0.3, -0.9);
  context.bezierCurveTo(0.7, -0.4, 0.6, 0.6, 0, 0.9);
  context.closePath();
  context.fill();

  context.strokeStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.spring.blossomPetal
    : SEASON_COLORS.spring.blossomPetal;
  context.lineWidth = 0.08;
  context.beginPath();
  context.moveTo(0, 0.8);
  context.lineTo(0, -0.35);
  context.stroke();
}

function renderSnowflake(
  context: CanvasRenderingContext2D,
  isDarkMode: boolean,
): void {
  const color = isDarkMode
    ? SEASON_NIGHT_COLORS.winter.snowWhite
    : SEASON_COLORS.winter.snowWhite;
  context.strokeStyle = color;
  context.lineWidth = 0.12;
  context.lineCap = "round";

  for (let armIndex = 0; armIndex < 3; armIndex++) {
    context.beginPath();
    context.moveTo(0, -1.0);
    context.lineTo(0, 1.0);

    context.moveTo(-0.25, -0.65);
    context.lineTo(0, -0.45);
    context.lineTo(0.25, -0.65);

    context.moveTo(-0.25, 0.65);
    context.lineTo(0, 0.45);
    context.lineTo(0.25, 0.65);
    context.stroke();

    context.rotate(Math.PI / 3);
  }

  context.fillStyle = isDarkMode
    ? SEASON_NIGHT_COLORS.winter.frostSlate
    : SEASON_COLORS.winter.snowWhite;
  context.beginPath();
  context.arc(0, 0, 0.18, 0, Math.PI * 2);
  context.fill();
}

export type SeasonalParticleType = "petal" | "snowflake" | "leaf";

function getWinterSpringParticle(
  p: number,
  particleHash: number,
): SeasonalParticleType {
  // 3.0 -> 3.3: strictly snow, zero leaves
  if (p <= 3.3) return "snowflake";
  // 3.3 -> 4.0: snow transitions into cherry blossom petals, strictly zero leaves
  const petalRatio = (p - 3.3) / 0.7;
  return particleHash < petalRatio ? "petal" : "snowflake";
}

export function getSeasonalParticleType(
  seasonProgress: number,
  particleHash: number,
): SeasonalParticleType {
  const p = ((seasonProgress % 4) + 4) % 4;

  // Winter into Spring transition (3.0 <= p < 4.0): Snow then petals, strictly zero leaves
  if (p >= 3.0) {
    return getWinterSpringParticle(p, particleHash);
  }

  // Spring into Summer (0.0 <= p <= 0.85): Petals transition into fresh green leaves
  if (p <= 0.85) {
    const petalRatio = 1 - p / 0.85;
    return particleHash < petalRatio ? "petal" : "leaf";
  }

  // Autumn into Winter (2.4 <= p < 3.0): Leaves transition into snow
  if (p >= 2.4) {
    const snowRatio = (p - 2.4) / 0.6;
    return particleHash < snowRatio ? "snowflake" : "leaf";
  }

  // Summer and Fall (0.85 < p < 2.4): 100% leaves
  return "leaf";
}

export class LeafParticle {
  public x = 0;
  public y = 0;
  public size = 12;
  public aspect = 0.65;
  public depth = 1.0;
  public opacity = 0.9;
  public speedFactor = 1.0;
  public driftAngleOffset = 0;
  public angle = 0;
  public angularVelocity = 0.01;
  public flutterPhase = 0;
  public flutterSpeed = 0.025;

  public constructor(
    isInitialDistribution: boolean,
    screenWidth: number,
    screenHeight: number,
    canopyPoint?: Point2D,
  ) {
    this.reset(isInitialDistribution, screenWidth, screenHeight, canopyPoint);
  }

  public reset(
    isInitialDistribution: boolean,
    screenWidth: number,
    screenHeight: number,
    canopyPoint?: Point2D,
  ): void {
    const isWide = screenWidth >= 900;
    const fallbackLeft = isWide ? screenWidth * 0.01 : screenWidth * -0.06;
    const fallbackTreeW = Math.max(480, Math.min(840, screenWidth * 0.5));
    const fallbackTreeH = Math.max(640, Math.min(1080, screenWidth * 0.68));
    const fallbackTreeTop = screenHeight - fallbackTreeH;

    const originPoint = canopyPoint ?? {
      x: fallbackLeft + fallbackTreeW * 0.49,
      y: fallbackTreeTop + fallbackTreeH * 0.3,
    };

    if (isInitialDistribution) {
      const spreadProgress = Math.random();
      this.x = originPoint.x + spreadProgress * (screenWidth - originPoint.x);
      const naturalDescent =
        spreadProgress * (screenHeight * 0.36) + (Math.random() - 0.5) * 80;
      this.y = Math.min(
        screenHeight - 60,
        Math.max(originPoint.y - 30, originPoint.y + naturalDescent),
      );
    } else {
      this.x = originPoint.x + (Math.random() - 0.5) * 60;
      this.y = originPoint.y + (Math.random() - 0.5) * 45;
    }

    this.size = 10 + Math.random() * 8;
    this.aspect = 0.6 + Math.random() * 0.15;
    this.depth = 0.7 + Math.random() * 0.5;
    this.opacity = 0.78 + Math.random() * 0.2;
    this.speedFactor = 0.82 + Math.random() * 0.4;
    this.driftAngleOffset = (Math.random() - 0.5) * 0.35;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.022;
    this.flutterPhase = Math.random() * Math.PI * 2;
    this.flutterSpeed = 0.02 + Math.random() * 0.025;
  }

  public update(
    windState: WindState,
    mouseState: MouseState,
    dimensions: Point2D,
    canopyPoint?: Point2D,
  ): void {
    this.flutterPhase += this.flutterSpeed;

    // Wind moves strictly horizontally
    const windSpeedX =
      windState.currentX *
      this.depth *
      this.speedFactor *
      (1 + windState.gustBoost);
    const flutterOffset = Math.sin(this.flutterPhase) * 0.45;
    const flutterLift = Math.cos(this.flutterPhase * 0.85) * 0.28;

    // Natural downward settling of leaves toward the ground
    const naturalFallSpeed = 0.38 * this.depth;

    // Gentle cursor deflection in X if cursor passes nearby
    const deltaX = this.x - mouseState.x;
    const deltaY = this.y - mouseState.y;
    const cursorDistance = Math.hypot(deltaX, deltaY);
    let deflectX = 0;
    if (cursorDistance < 65 && cursorDistance > 2) {
      const pushStrength = (1 - cursorDistance / 65) * 0.8;
      deflectX = (deltaX / cursorDistance) * pushStrength;
    }

    this.x += windSpeedX + flutterOffset + deflectX;
    this.y += naturalFallSpeed + flutterLift;

    this.angle += this.angularVelocity;

    const pad = 60;
    const isOffScreen =
      this.x > dimensions.x + pad ||
      this.x < -pad ||
      this.y > dimensions.y - 20;

    if (isOffScreen) {
      this.reset(false, dimensions.x, dimensions.y, canopyPoint);
    }
  }

  public draw(
    context: CanvasRenderingContext2D,
    isDarkMode: boolean,
    seasonProgress = 1.0,
  ): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    const scaleFactorX = Math.cos(this.flutterPhase) * (this.size * this.depth);
    const scaleFactorY = this.size * this.aspect * this.depth;

    context.scale(scaleFactorX, scaleFactorY);
    context.globalAlpha = this.opacity;

    const particleHash = Math.max(
      0,
      Math.min(1, (this.driftAngleOffset + 0.175) / 0.35),
    );
    const particleType = getSeasonalParticleType(seasonProgress, particleHash);

    if (particleType === "petal") {
      renderCherryPetal(context, isDarkMode);
    } else if (particleType === "snowflake") {
      renderSnowflake(context, isDarkMode);
    } else {
      const palette = getSeasonalLeafPalette(seasonProgress, isDarkMode);
      renderLeftSegments(context, palette);
      renderRightSegments(context, palette);
      renderVeinsAndStem(context, palette);
    }

    context.restore();
  }
}

export class WindBreezeStream {
  public x = 0;
  public y = 0;
  public length = 110;
  public speed = 1.0;
  public thickness = 1.2;
  public opacity = 0.12;
  public waveFrequency = 0.018;
  public waveAmplitude = 6;
  public wavePhase = 0;
  public angle = 0;

  public constructor(
    screenWidth: number,
    screenHeight: number,
    windState?: WindState,
    isInitial = true,
  ) {
    this.reset(screenWidth, screenHeight, windState, isInitial);
  }

  public reset(
    screenWidth: number,
    screenHeight: number,
    windState?: WindState,
    isInitial = false,
  ): void {
    this.length = 80 + Math.random() * 100;
    this.speed = 0.85 + Math.random() * 0.5;
    this.thickness = 0.8 + Math.random() * 1.0;
    this.opacity = 0.07 + Math.random() * 0.11;
    this.waveFrequency = 0.015 + Math.random() * 0.015;
    this.waveAmplitude = 4 + Math.random() * 6;
    this.wavePhase = Math.random() * Math.PI * 2;

    const isBlowingLeft = Boolean(windState && windState.currentX < 0);
    this.angle = isBlowingLeft ? Math.PI : 0;

    if (isInitial) {
      this.x = Math.random() * screenWidth;
      this.y = 50 + Math.random() * (screenHeight * 0.7);
      return;
    }

    if (isBlowingLeft) {
      this.x = screenWidth + 20 + Math.random() * 40;
    } else {
      this.x = -this.length - 20 - Math.random() * 40;
    }
    this.y = 50 + Math.random() * (screenHeight * 0.7);
  }

  public update(
    windState: WindState,
    screenWidth: number,
    screenHeight: number,
  ): void {
    const targetAngle = windState.currentX < 0 ? Math.PI : 0;
    let angleDiff = targetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    this.angle += angleDiff * 0.05;

    const windSpeed = Math.abs(windState.currentX);
    const moveRate =
      this.speed * Math.max(0.6, windSpeed) * (1 + windState.gustBoost * 1.2);

    this.x += Math.cos(this.angle) * moveRate;
    this.wavePhase += 0.022;

    const pad = this.length + 60;
    const isOutside =
      this.x < -pad ||
      this.x > screenWidth + pad ||
      this.y < -pad ||
      this.y > screenHeight + pad;

    if (isOutside) {
      this.reset(screenWidth, screenHeight, windState, false);
    }
  }

  public draw(context: CanvasRenderingContext2D, isDarkMode: boolean): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    const gradient = context.createLinearGradient(0, 0, this.length, 0);
    const baseRgb = isDarkMode ? "rgba(42, 161, 152," : "rgba(255, 255, 255,";
    gradient.addColorStop(0, `${baseRgb} 0)`);
    gradient.addColorStop(0.25, `${baseRgb} ${this.opacity})`);
    gradient.addColorStop(0.75, `${baseRgb} ${this.opacity})`);
    gradient.addColorStop(1, `${baseRgb} 0)`);

    context.strokeStyle = gradient;
    context.lineWidth = this.thickness;
    context.lineCap = "round";
    context.beginPath();

    for (let stepDistance = 0; stepDistance < this.length; stepDistance += 12) {
      const pointX = stepDistance;
      const pointY =
        Math.sin(this.wavePhase + stepDistance * this.waveFrequency) *
        this.waveAmplitude;

      if (stepDistance === 0) {
        context.moveTo(pointX, pointY);
      } else {
        context.lineTo(pointX, pointY);
      }
    }

    context.stroke();
    context.restore();
  }
}
