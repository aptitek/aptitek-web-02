import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import { ThemeModeProvider } from "~/utils/themeContext";
import { SolarizedBackground } from "./SolarizedBackground";
import { computeTargetWindVector } from "./useSolarizedCanvas";
import {
  LeafParticle,
  WindBreezeStream,
  getSeasonalParticleType,
} from "./SolarizedLeafRenderer";
import {
  CANOPY_BUD_THRESHOLDS,
  getCanopyClusterFill,
} from "./SolarizedLandscapeShapeDefs";
import {
  SPRING_FLOWER_SCHEDULES,
  getFlowerBloomFactor,
} from "./SpringMeadowFlowers";
import type { WindState, MouseState } from "./SolarizedBackground.types";
import {
  resolveSeasonProgress,
  getSeasonalCanopyTokens,
  getSeasonalHillTokens,
  getSeasonalGrassTokens,
  getSeasonalLeafPalette,
} from "./seasonUtils";

describe("SolarizedBackground Component", () => {
  beforeEach(() => {
    // Mock canvas getContext('2d') for headless test environments
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      lineCap: "round",
      globalAlpha: 1,
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    // Mock ResizeObserver
    globalThis.ResizeObserver = class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    } as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders without crashing with default props", () => {
    const { container } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground data-testid="solarized-bg" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container).toBeDefined();
    const canvasElement = container.querySelector("canvas");
    expect(canvasElement).toBeDefined();
  });

  it("renders children in foreground content wrapper", () => {
    render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground>
            <div data-testid="foreground-content">Welcome to Aptitek</div>
          </SolarizedBackground>
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    const childNode = screen.getByTestId("foreground-content");
    expect(childNode).toBeDefined();
    expect(childNode.textContent).toBe("Welcome to Aptitek");
  });

  it("respects showTree={false} prop", () => {
    const { container } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground showTree={false} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    const treeContainer = container.querySelector("#peacefulTreeContainer");
    expect(treeContainer).toBeNull();
  });

  it("respects showCelestial={false} prop", () => {
    const { container } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground showCelestial={false} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    const celestialContainer = container.querySelector(
      "#celestialBodyContainer",
    );
    expect(celestialContainer).toBeNull();
  });

  it("supports explicit mode='light', mode='sunset', and mode='dark'", () => {
    const { rerender, container } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="light" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    // Light mode should have celestial container with sun orb
    expect(container.querySelector("#celestialBodyContainer")).toBeDefined();

    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="sunset" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    // Sunset mode should also render daylight sun orb and no starfield
    expect(container.querySelector("#celestialBodyContainer")).toBeDefined();
    expect(container.querySelector(".starfield-overlay")).toBeNull();

    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="dark" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    // Dark mode should render celestial container with crescent moon
    expect(container.querySelector("#celestialBodyContainer")).toBeDefined();
  });

  it("respects showGrass={false} prop and renders grass blades with gradient", () => {
    const { container, rerender } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground showGrass={false} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container.querySelector(".grass-blade-primary")).toBeNull();

    // Rerender in light mode with showGrass={true} -> grass blades and gradient are present
    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="light" showGrass={true} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );
    expect(container.querySelector(".grass-blade-primary")).not.toBeNull();
    expect(container.querySelector("#grassBladePrimaryGrad")).not.toBeNull();

    // Rerender in dark mode with showGrass={true} -> grass blades remain present
    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="dark" showGrass={true} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );
    expect(container.querySelector(".grass-blade-primary")).not.toBeNull();
    expect(container.querySelector("#grassBladePrimaryGrad")).not.toBeNull();
  });

  it("respects showGodrays={false} in light mode", () => {
    const { container } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground mode="light" showGodrays={false} />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container.querySelector("#godrayBeamGrad")).toBeNull();
  });

  it("calculates gentle horizontal breeze velocity and steers direction along cursor X", () => {
    const origin = { x: 200, y: 250 };
    const mockMouse: MouseState = {
      x: 600,
      y: 100, // Top-right of origin
      targetX: 600,
      targetY: 100,
      speedX: 0,
      speedY: 0,
    };

    const windVectorRight = computeTargetWindVector({
      mouseState: mockMouse,
      origin,
      windIntensity: 1.0,
    });

    // Breeze CANNOT move vertically: y must be strictly 0
    expect(windVectorRight.y).toBe(0);
    // Speed should be slower (~0.85-1.0 px/frame)
    expect(windVectorRight.x).toBeGreaterThan(0); // Blowing rightwards towards cursor
    expect(windVectorRight.x).toBeLessThan(1.5); // Slower, tranquil speed

    // Move mouse to left of tree
    mockMouse.x = 50;
    mockMouse.y = 450;
    const windVectorLeft = computeTargetWindVector({
      mouseState: mockMouse,
      origin,
      windIntensity: 1.0,
    });
    expect(windVectorLeft.y).toBe(0); // Strictly zero vertical wind
    expect(windVectorLeft.x).toBeLessThan(0); // Blowing leftwards towards cursor
  });

  it("WindBreezeStream and LeafParticle update along horizontal wind vector with natural fall", () => {
    const windState: WindState = {
      baseSpeedX: 0.85,
      baseSpeedY: 0,
      currentX: 0.85,
      currentY: 0,
      gustBoost: 0,
    };

    const stream = new WindBreezeStream(800, 600, windState, false);
    stream.x = 100;
    stream.y = 100;
    stream.update(windState, 800, 600);

    // Stream moves horizontally (currentX > 0), y remains constant (no vertical breeze)
    expect(stream.x).toBeGreaterThan(100);
    expect(stream.y).toBe(100);

    const leaf = new LeafParticle(false, 800, 600, { x: 150, y: 150 });
    const initialLeafX = leaf.x;
    const initialLeafY = leaf.y;
    const neutralMouse: MouseState = {
      x: 800,
      y: 600,
      targetX: 800,
      targetY: 600,
      speedX: 0,
      speedY: 0,
    };

    leaf.update(windState, neutralMouse, { x: 800, y: 600 });
    expect(leaf.x).toBeGreaterThan(initialLeafX);
    // leaf naturally settles gently toward ground
    expect(leaf.y).toBeGreaterThan(initialLeafY);
  });

  it("resolves season progress correctly for named variants and continuous values", () => {
    expect(resolveSeasonProgress("spring")).toBe(0.0);
    expect(resolveSeasonProgress("summer")).toBe(1.0);
    expect(resolveSeasonProgress("fall")).toBe(2.0);
    expect(resolveSeasonProgress("autumn")).toBe(2.0);
    expect(resolveSeasonProgress("winter")).toBe(3.0);
    expect(resolveSeasonProgress(undefined)).toBe(1.0); // Default summer
    expect(resolveSeasonProgress("summer", 2.5)).toBe(2.5); // Slider overrides
  });

  it("calculates seasonal canopy tokens and blossom/snow presence", () => {
    // Spring (progress = 0) has peak cherry blossoms and 0 snow
    const springTokens = getSeasonalCanopyTokens(0.0, false);
    expect(springTokens.blossomOpacity).toBeGreaterThan(0.8);
    expect(springTokens.snowOpacity).toBe(0.0);

    // Summer (progress = 1) has 0 blossoms and 0 snow, with pure botanical greens (no blue)
    const summerTokens = getSeasonalCanopyTokens(1.0, false);
    expect(summerTokens.blossomOpacity).toBe(0.0);
    expect(summerTokens.snowOpacity).toBe(0.0);
    expect(summerTokens.foliage2A).not.toContain("268bd2"); // Not blue
    expect(summerTokens.foliage2B).not.toContain("2aa198"); // Not cyan

    // Winter (progress = 3) has peak snow and 0 blossoms
    const winterTokens = getSeasonalCanopyTokens(3.0, false);
    expect(winterTokens.snowOpacity).toBeGreaterThan(0.8);
    expect(winterTokens.blossomOpacity).toBe(0.0);
  });

  it("renders spring floor flowers and winter snow caps, with clean tree canopy", () => {
    const { container, rerender } = render(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground season="spring" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container.querySelector("#treeCherryBlossoms")).toBeNull();
    expect(container.querySelector("#springFloorFlowers")).not.toBeNull();
    expect(container.querySelector("#springMeadowFloorFlowers")).not.toBeNull();
    expect(container.querySelector("#treeWinterSnow")).toBeNull();

    // Rerender in winter
    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground season="winter" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container.querySelector("#treeCherryBlossoms")).toBeNull();
    expect(container.querySelector("#springFloorFlowers")).toBeNull();
    expect(container.querySelector("#treeWinterSnow")).not.toBeNull();

    // Rerender in summer
    rerender(
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <SolarizedBackground season="summer" />
        </ThemeProvider>
      </ThemeModeProvider>,
    );

    expect(container.querySelector("#treeCherryBlossoms")).toBeNull();
    expect(container.querySelector("#springFloorFlowers")).toBeNull();
    expect(container.querySelector("#treeWinterSnow")).toBeNull();
  });

  it("renders particles across seasonal slider without errors", () => {
    const mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      lineCap: "round",
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const particle = new LeafParticle(false, 800, 600, { x: 100, y: 100 });

    // Draw in Spring (petals)
    expect(() => particle.draw(mockContext, false, 0.0)).not.toThrow();
    // Draw in Summer (botanical green leaves)
    expect(() => particle.draw(mockContext, false, 1.0)).not.toThrow();
    // Draw in Fall (orange leaves)
    expect(() => particle.draw(mockContext, false, 2.0)).not.toThrow();
    // Draw in Winter (snowflakes)
    expect(() => particle.draw(mockContext, false, 3.0)).not.toThrow();

    // Verify fall palette is warm/orange
    const fallPalette = getSeasonalLeafPalette(2.0, false);
    expect(fallPalette.leftMid).toBeDefined();
    expect(fallPalette.vein).toBeDefined();
  });

  it("uses mindful seasonal dark mode palettes without jarring electric neon colors", () => {
    // Summer night canopy does NOT have cyan or blue circles
    const summerNightCanopy = getSeasonalCanopyTokens(1.0, true);
    expect(summerNightCanopy.foliage2A).not.toContain("268bd2");
    expect(summerNightCanopy.foliage2B).not.toContain("2aa198");
    expect(summerNightCanopy.foliage2A).not.toContain("6c71c4");

    // Spring night canopy uses nocturnal cherry/rose tones
    const springNightCanopy = getSeasonalCanopyTokens(0.0, true);
    expect(springNightCanopy.blossomOpacity).toBeGreaterThan(0.8);
    expect(springNightCanopy.snowOpacity).toBe(0.0);

    // Fall night canopy uses rich nocturnal russet/amber
    const fallNightCanopy = getSeasonalCanopyTokens(2.0, true);
    expect(fallNightCanopy.foliage1A).toBeDefined();

    // Winter night canopy uses frosted slate
    const winterNightCanopy = getSeasonalCanopyTokens(3.0, true);
    expect(winterNightCanopy.snowOpacity).toBeGreaterThan(0.8);

    // Seasonal dark mode hills and grass
    const springHills = getSeasonalHillTokens(0.0, true);
    const fallGrass = getSeasonalGrassTokens(2.0, true);
    expect(springHills.hillBack).toBeDefined();
    expect(fallGrass.primaryStart).toBeDefined();

    // Seasonal leaf palettes in dark mode
    const springNightLeaf = getSeasonalLeafPalette(0.0, true);
    const fallNightLeaf = getSeasonalLeafPalette(2.0, true);
    expect(springNightLeaf.leftTop).toBeDefined();
    expect(fallNightLeaf.leftMid).toBeDefined();

    // Particle draw in dark mode across all seasons
    const mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      lineCap: "round",
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const particle = new LeafParticle(true, 800, 600, { x: 100, y: 100 });
    expect(() => particle.draw(mockContext, true, 0.0)).not.toThrow();
    expect(() => particle.draw(mockContext, true, 1.0)).not.toThrow();
    expect(() => particle.draw(mockContext, true, 2.0)).not.toThrow();
    expect(() => particle.draw(mockContext, true, 3.0)).not.toThrow();
  });

  it("strictly suppresses falling leaves between winter and spring in favor of snow and petals", () => {
    // 1. In Winter (3.0): all particles are snowflakes
    for (let hash = 0; hash < 1; hash += 0.1) {
      expect(getSeasonalParticleType(3.0, hash)).toBe("snowflake");
    }

    // 2. Right after Winter (3.1 - 3.3): strictly snow, zero leaves or petals
    for (const p of [3.05, 3.1, 3.2, 3.29, 3.3]) {
      for (let hash = 0; hash < 1; hash += 0.1) {
        expect(getSeasonalParticleType(p, hash)).toBe("snowflake");
      }
    }

    // 3. Between 3.3 and 4.0: snow transitions into flower petals, strictly ZERO leaves
    for (const p of [3.35, 3.5, 3.65, 3.8, 3.95]) {
      for (let hash = 0; hash < 1; hash += 0.05) {
        const particleType = getSeasonalParticleType(p, hash);
        expect(["snowflake", "petal"]).toContain(particleType);
        expect(particleType).not.toBe("leaf");
      }
    }

    // 4. In Spring (4.0 / 0.0): all particles are petals
    for (let hash = 0; hash < 1; hash += 0.1) {
      expect(getSeasonalParticleType(4.0, hash)).toBe("petal");
      expect(getSeasonalParticleType(0.0, hash)).toBe("petal");
    }

    // 5. Spring to summer (0.0 to 0.6): petals transition into fresh green leaves
    expect(getSeasonalParticleType(0.3, 0.1)).toBe("petal");
    expect(getSeasonalParticleType(0.3, 0.9)).toBe("leaf");

    // 6. Summer and early Autumn (0.6 to 2.4): 100% leaves
    expect(getSeasonalParticleType(1.0, 0.2)).toBe("leaf");
    expect(getSeasonalParticleType(1.5, 0.5)).toBe("leaf");
    expect(getSeasonalParticleType(2.0, 0.8)).toBe("leaf");

    // 7. Late Autumn to Winter (2.4 to 3.0): leaves transition into snowflakes
    expect(getSeasonalParticleType(2.7, 0.1)).toBe("snowflake");
    expect(getSeasonalParticleType(2.7, 0.9)).toBe("leaf");
  });

  it("transitions tree canopy in spring from pink to green via staggered cluster budding without intermediate muddy colors", () => {
    expect(CANOPY_BUD_THRESHOLDS).toHaveLength(17);

    // At Spring (0.0): all 17 canopy clusters use Spring cherry blossom pink gradients
    for (let i = 0; i < 17; i++) {
      const fill1 = getCanopyClusterFill(i, "grad1", 0.0);
      const fill2 = getCanopyClusterFill(i, "grad2", 0.0);
      const fillWarm = getCanopyClusterFill(i, "warm", 0.0);
      expect(fill1).toBe("url(#treeCanopyGrad1Spring)");
      expect(fill2).toBe("url(#treeCanopyGrad2Spring)");
      expect(fillWarm).toBe("url(#treeCanopyWarmSpring)");
    }

    // Mid-spring (0.5): clusters are either purely Spring (pink) or purely Summer (green)
    let greenCount = 0;
    let pinkCount = 0;
    for (let i = 0; i < 17; i++) {
      const fill = getCanopyClusterFill(i, "grad1", 0.5);
      if (fill === "url(#treeCanopyGrad1Summer)") greenCount++;
      if (fill === "url(#treeCanopyGrad1Spring)") pinkCount++;
    }
    expect(greenCount + pinkCount).toBe(17);
    expect(greenCount).toBeGreaterThan(5);
    expect(pinkCount).toBeGreaterThan(5);

    // At Summer (1.0) and later: all clusters use standard seasonal gradients
    for (let i = 0; i < 17; i++) {
      expect(getCanopyClusterFill(i, "grad1", 1.0)).toBe(
        "url(#treeCanopyGrad1)",
      );
      expect(getCanopyClusterFill(i, "grad2", 2.0)).toBe(
        "url(#treeCanopyGrad2)",
      );
      expect(getCanopyClusterFill(i, "warm", 3.0)).toBe("url(#treeCanopyWarm)");
    }
  });

  it("blooms meadow floor flowers in staggered appearing sequence across spring without monolithic fading", () => {
    expect(SPRING_FLOWER_SCHEDULES).toHaveLength(20);

    // Winter (3.0): strictly zero flowers
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      expect(
        getFlowerBloomFactor(3.0, schedule.bloomIn, schedule.bloomOut),
      ).toBe(0);
    }

    // Right after winter (3.2): strictly zero flowers
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      expect(
        getFlowerBloomFactor(3.2, schedule.bloomIn, schedule.bloomOut),
      ).toBe(0);
    }

    // Late thaw into spring (3.65): flowers appear one by one
    let thawingBloomed = 0;
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      const factor = getFlowerBloomFactor(
        3.65,
        schedule.bloomIn,
        schedule.bloomOut,
      );
      if (factor > 0) thawingBloomed++;
    }
    expect(thawingBloomed).toBeGreaterThan(5);
    expect(thawingBloomed).toBeLessThan(20);

    // Peak spring (0.0): all 20 flowers in full bloom
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      expect(
        getFlowerBloomFactor(0.0, schedule.bloomIn, schedule.bloomOut),
      ).toBe(1);
    }

    // Mid-spring into summer (0.5): flowers depart one by one
    let summerTransitionBloomed = 0;
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      const factor = getFlowerBloomFactor(
        0.5,
        schedule.bloomIn,
        schedule.bloomOut,
      );
      if (factor > 0) summerTransitionBloomed++;
    }
    expect(summerTransitionBloomed).toBeGreaterThan(5);
    expect(summerTransitionBloomed).toBeLessThan(20);

    // Summer (1.0) and Fall (2.0): strictly zero flowers
    for (const schedule of SPRING_FLOWER_SCHEDULES) {
      expect(
        getFlowerBloomFactor(1.0, schedule.bloomIn, schedule.bloomOut),
      ).toBe(0);
      expect(
        getFlowerBloomFactor(2.0, schedule.bloomIn, schedule.bloomOut),
      ).toBe(0);
    }
  });
});
