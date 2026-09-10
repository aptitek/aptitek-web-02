import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CvDocument } from "./CvDocument";

describe("CvDocument Organism (Fluid Web)", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders fluid web view and document sections without headerbar", () => {
    render(<CvDocument initialTheme="light" />);

    expect(screen.getByTestId("cv-document")).toBeDefined();
    expect(screen.getByTestId("cv-fluid-view")).toBeDefined();
    expect(screen.getByLabelText("Profil et Parcours")).toBeDefined();
    expect(screen.getByLabelText("Thèse et Publications")).toBeDefined();

    // Verify headerbar controls are completely absent
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByText(/filtrer par compétences/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /copier email/i })).toBeNull();
  });

  it("renders Floating Action Button for PDF download", () => {
    render(<CvDocument />);

    const fabLink = screen.getByTestId("fab-pdf");
    expect(fabLink).toBeDefined();
    expect(fabLink.tagName.toLowerCase()).toBe("a");
    expect(fabLink.getAttribute("href")).toBe("/cv.pdf");
    expect(fabLink.getAttribute("download")).toBe("CV-Antoine-Grea.pdf");
    expect(fabLink.getAttribute("target")).toBe("_blank");
    expect(fabLink.getAttribute("aria-label")).toMatch(/télécharger le cv/i);
  });

  it("supports custom pdfUrl and download name", () => {
    render(
      <CvDocument
        pdfUrl="/custom-cv.pdf"
        pdfDownloadName="Custom-Resume.pdf"
      />,
    );

    const fabLink = screen.getByTestId("fab-pdf");
    expect(fabLink.getAttribute("href")).toBe("/custom-cv.pdf");
    expect(fabLink.getAttribute("download")).toBe("Custom-Resume.pdf");
  });

  it("applies initialTheme to container data-theme and class", () => {
    const { rerender } = render(<CvDocument initialTheme="light" />);

    const docEl = screen.getByTestId("cv-document");
    expect(docEl.getAttribute("data-theme")).toBe("light");
    expect(docEl.className).toContain("theme-light");

    rerender(<CvDocument initialTheme="dark" />);
    expect(docEl.getAttribute("data-theme")).toBe("dark");
    expect(docEl.className).toContain("theme-dark");
  });
});
