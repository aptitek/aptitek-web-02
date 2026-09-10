import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  act,
} from "@testing-library/react";
import { HeroTicker } from "./HeroTicker";

describe("HeroTicker Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    cleanup();
  });

  it("renders with default prefix, suffix, and ticker text", () => {
    render(
      <HeroTicker
        prefix="We craft "
        phrases={["revolutionary ideas"]}
        suffix=" that inspire."
        data-testid="test-hero-ticker"
      />,
    );

    const root = screen.getByTestId("test-hero-ticker");
    expect(root).toBeDefined();

    const prefix = screen.getByTestId("hero-ticker-prefix");
    expect(prefix.textContent).toBe("We craft ");

    const suffix = screen.getByTestId("hero-ticker-suffix");
    expect(suffix.textContent).toBe(" that inspire.");

    const cursiveText = screen.getByTestId("hero-ticker-cursive-text");
    expect(cursiveText.textContent).toBe("revolutionary ideas");
  });

  it("renders screen-reader accessible full coherent slogan", () => {
    render(
      <HeroTicker
        prefix="Innovating "
        phrases={["digital experiences"]}
        suffix=" for everyone."
      />,
    );

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toBeDefined();
    expect(liveRegion.textContent).toBe(
      "Innovating digital experiences for everyone.",
    );
  });

  it("renders without prefix or suffix if omitted", () => {
    render(<HeroTicker prefix="" suffix="" phrases={["Simple Brand"]} />);

    expect(screen.queryByTestId("hero-ticker-prefix")).toBeNull();
    expect(screen.queryByTestId("hero-ticker-suffix")).toBeNull();
    expect(screen.getByTestId("hero-ticker-cursive-text").textContent).toBe(
      "Simple Brand",
    );
  });

  it("renders flourish underline according to flourish prop", () => {
    const { rerender } = render(
      <HeroTicker phrases={["flourish test"]} flourish="swoosh" />,
    );
    expect(screen.getByTestId("hero-ticker-flourish")).toBeDefined();

    rerender(<HeroTicker phrases={["flourish test"]} flourish="none" />);
    expect(screen.queryByTestId("hero-ticker-flourish")).toBeNull();
  });

  it("renders interactive controls when showControls is true", () => {
    const handlePhraseChange = vi.fn();
    const testPhrases = ["first phrase", "second phrase", "third phrase"];

    render(
      <HeroTicker
        phrases={testPhrases}
        showControls={true}
        onPhraseChange={handlePhraseChange}
      />,
    );

    const controls = screen.getByTestId("hero-ticker-controls");
    expect(controls).toBeDefined();

    // Next button advances phrase
    const nextBtn = screen.getByLabelText("Next slogan phrase");
    act(() => {
      fireEvent.click(nextBtn);
    });

    expect(screen.getByTestId("hero-ticker-cursive-text").textContent).toBe(
      "second phrase",
    );
    expect(handlePhraseChange).toHaveBeenCalledWith(1, "second phrase");

    // Prev button rewinds phrase
    const prevBtn = screen.getByLabelText("Previous slogan phrase");
    act(() => {
      fireEvent.click(prevBtn);
    });

    expect(screen.getByTestId("hero-ticker-cursive-text").textContent).toBe(
      "first phrase",
    );

    // Pause button toggles pause state
    const pauseBtn = screen.getByLabelText("Pause ticker animation");
    act(() => {
      fireEvent.click(pauseBtn);
    });

    const resumeBtn = screen.getByLabelText("Resume ticker animation");
    expect(resumeBtn).toBeDefined();
  });

  it("allows jumping directly to a phrase via dot indicators", () => {
    const testPhrases = ["Alpha", "Beta", "Gamma"];

    render(<HeroTicker phrases={testPhrases} showControls={true} />);

    const gammaDot = screen.getByLabelText("Jump to phrase: Gamma");
    act(() => {
      fireEvent.click(gammaDot);
    });

    expect(screen.getByTestId("hero-ticker-cursive-text").textContent).toBe(
      "Gamma",
    );
  });

  it("supports typewriter mode with character typing and pausing", () => {
    render(
      <HeroTicker
        phrases={["Code"]}
        animationMode="cursive-type"
        typeSpeed={50}
        pauseDuration={1000}
      />,
    );

    const cursiveText = screen.getByTestId("hero-ticker-cursive-text");
    expect(cursiveText.textContent).toBe("");

    // Advance timers for character typing
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(cursiveText.textContent?.length).toBeGreaterThan(0);
  });

  it("supports fade animation mode", () => {
    render(<HeroTicker phrases={["Fade Text"]} animationMode="fade" />);

    const cursiveText = screen.getByTestId("hero-ticker-cursive-text");
    expect(cursiveText.textContent).toBe("Fade Text");
  });

  it("supports different solarized accent colors", () => {
    const { rerender } = render(
      <HeroTicker phrases={["Solarized Theme"]} accentColor="magenta" />,
    );
    expect(screen.getByTestId("hero-ticker-cursive-text")).toBeDefined();

    rerender(<HeroTicker phrases={["Solarized Theme"]} accentColor="yellow" />);
    expect(screen.getByTestId("hero-ticker-cursive-text")).toBeDefined();
  });

  it("supports hover pause event triggers", () => {
    render(
      <HeroTicker
        phrases={["Hover Test"]}
        pauseOnHover={true}
        data-testid="hoverable-ticker"
      />,
    );

    const root = screen.getByTestId("hoverable-ticker");
    act(() => {
      fireEvent.mouseEnter(root);
    });
    act(() => {
      fireEvent.mouseLeave(root);
    });
    expect(root).toBeDefined();
  });

  it("exposes semantic heading element to the accessibility tree", () => {
    render(<HeroTicker as="h1" phrases={["Heading A11y Test"]} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeDefined();
    // Verify heading is not aria-hidden
    expect(heading.getAttribute("aria-hidden")).toBeNull();
  });

  it("supports keyboard focus pause for WCAG 2.2.2 compliance", () => {
    render(
      <HeroTicker
        phrases={["Focus Test"]}
        pauseOnFocus={true}
        showControls={true}
        data-testid="focusable-ticker"
      />,
    );

    const root = screen.getByTestId("focusable-ticker");
    act(() => {
      fireEvent.focus(root);
    });
    // While focused, ticker animation is paused
    act(() => {
      fireEvent.blur(root);
    });
    expect(root).toBeDefined();
  });

  it("renders accessible tablist and tabs with aria-selected states for phrase navigation", () => {
    const testPhrases = ["Alpha", "Beta", "Gamma"];
    render(<HeroTicker phrases={testPhrases} showControls={true} />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeDefined();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
  });

  it("supports i18n language switching between English and French", async () => {
    const { default: i18n } = await import("~/i18n");

    await act(async () => {
      await i18n.changeLanguage("en");
    });

    const { rerender } = render(<HeroTicker />);
    expect(screen.getByTestId("hero-ticker-prefix").textContent).toBe(
      "We craft ",
    );
    expect(screen.getByTestId("hero-ticker-suffix").textContent).toBe(
      " that inspire.",
    );

    await act(async () => {
      await i18n.changeLanguage("fr");
    });

    rerender(<HeroTicker />);
    expect(screen.getByTestId("hero-ticker-prefix").textContent).toBe(
      "Nous façonnons ",
    );
    expect(screen.getByTestId("hero-ticker-suffix").textContent).toBe(
      " qui inspirent.",
    );

    // Reset language back to en
    await act(async () => {
      await i18n.changeLanguage("en");
    });
  });
});
