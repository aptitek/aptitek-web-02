import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CvActionButton } from "./CvActionButton";

describe("CvActionButton Atom", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders as button when no href is provided", () => {
    const handleClick = vi.fn();
    render(
      <CvActionButton onClick={handleClick} icon={<span>🖨️</span>}>
        Imprimer
      </CvActionButton>,
    );

    const btn = screen.getByRole("button", { name: /imprimer/i });
    expect(btn).toBeDefined();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as link when href is provided", () => {
    render(
      <CvActionButton href="/cv.pdf" download="cv.pdf" variant="primary">
        Télécharger PDF
      </CvActionButton>,
    );

    const link = screen.getByRole("link", { name: /télécharger pdf/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/cv.pdf");
    expect(link.getAttribute("download")).toBe("cv.pdf");
  });
});
