import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CvDocument } from "./CvDocument";

describe("CvDocument Organism (Fluid Web)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders fluid web view and document sections", () => {
    render(<CvDocument initialTheme="light" />);

    expect(screen.getByTestId("cv-document")).toBeDefined();
    expect(screen.getByTestId("cv-fluid-view")).toBeDefined();
    expect(screen.getByLabelText("Profil et Parcours")).toBeDefined();
    expect(screen.getByLabelText("Thèse et Publications")).toBeDefined();
  });

  it("toggles theme between light and dark", () => {
    render(<CvDocument initialTheme="light" />);

    const docEl = screen.getByTestId("cv-document");
    expect(docEl.getAttribute("data-theme")).toBe("light");

    const darkBtn = screen.getByRole("tab", { name: /sombre/i });
    fireEvent.click(darkBtn);

    expect(docEl.getAttribute("data-theme")).toBe("dark");
  });

  it("filters by skill and updates entry highlights", () => {
    render(<CvDocument initialTheme="light" />);

    const aiSkillBtn = screen.getByTestId("skill-tag-ai");
    expect(aiSkillBtn.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(aiSkillBtn);
    expect(aiSkillBtn.getAttribute("aria-pressed")).toBe("true");

    // Check reset button appears and works
    const resetBtn = screen.getByRole("button", {
      name: /réinitialiser le filtre/i,
    });
    expect(resetBtn).toBeDefined();

    fireEvent.click(resetBtn);
    expect(aiSkillBtn.getAttribute("aria-pressed")).toBe("false");
  });
});
