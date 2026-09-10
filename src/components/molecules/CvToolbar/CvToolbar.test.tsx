import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CvToolbar } from "./CvToolbar";

describe("CvToolbar Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  const mockSkills = [
    { id: "ai", label: "IA & LLM", color: "magenta" as const },
    { id: "python", label: "Python", color: "violet" as const },
  ];

  it("handles theme mode changes", () => {
    const onThemeModeChange = vi.fn();
    const onSelectSkill = vi.fn();

    render(
      <CvToolbar
        themeMode="light"
        onThemeModeChange={onThemeModeChange}
        skills={mockSkills}
        selectedSkill={null}
        onSelectSkill={onSelectSkill}
      />,
    );

    const darkBtn = screen.getByRole("tab", { name: /sombre/i });
    fireEvent.click(darkBtn);

    expect(onThemeModeChange).toHaveBeenCalledWith("dark");
  });

  it("renders PDF download link with correct attributes", () => {
    render(
      <CvToolbar
        themeMode="light"
        onThemeModeChange={vi.fn()}
        skills={mockSkills}
        selectedSkill={null}
        onSelectSkill={vi.fn()}
        pdfUrl="/cv.pdf"
      />,
    );

    const pdfLink = screen.getByRole("link", {
      name: /télécharger pdf/i,
    });
    expect(pdfLink).toBeDefined();
    expect(pdfLink.getAttribute("href")).toBe("/cv.pdf");
    expect(pdfLink.getAttribute("download")).toBe("CV-Antoine-Grea.pdf");
  });

  it("handles copy email and phone click actions", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      configurable: true,
    });

    render(
      <CvToolbar
        themeMode="light"
        onThemeModeChange={vi.fn()}
        skills={mockSkills}
        selectedSkill={null}
        onSelectSkill={vi.fn()}
        email="antoine@aptitek.io"
        phone="+33 7 66 77 21 26"
      />,
    );

    const copyEmailBtn = screen.getByRole("button", {
      name: /copier email/i,
    });
    fireEvent.click(copyEmailBtn);
    expect(writeTextMock).toHaveBeenCalledWith("antoine@aptitek.io");

    const copyPhoneBtn = screen.getByRole("button", {
      name: /copier tel/i,
    });
    fireEvent.click(copyPhoneBtn);
    expect(writeTextMock).toHaveBeenCalledWith("+33 7 66 77 21 26");
  });

  it("selects skill and handles reset filter", () => {
    const onSelectSkill = vi.fn();

    const { rerender } = render(
      <CvToolbar
        themeMode="light"
        onThemeModeChange={vi.fn()}
        skills={mockSkills}
        selectedSkill={null}
        onSelectSkill={onSelectSkill}
      />,
    );

    const aiSkillBtn = screen.getByTestId("skill-tag-ai");
    fireEvent.click(aiSkillBtn);
    expect(onSelectSkill).toHaveBeenCalledWith("ai");

    // Re-render with active skill
    rerender(
      <CvToolbar
        themeMode="light"
        onThemeModeChange={vi.fn()}
        skills={mockSkills}
        selectedSkill="ai"
        onSelectSkill={onSelectSkill}
      />,
    );

    const resetBtn = screen.getByRole("button", {
      name: /réinitialiser le filtre/i,
    });
    fireEvent.click(resetBtn);
    expect(onSelectSkill).toHaveBeenCalledWith(null);
  });
});
