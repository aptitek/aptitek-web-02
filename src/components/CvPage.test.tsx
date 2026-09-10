import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CvPage } from "./CvPage";

describe("CvPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders page with ThemeSwitch and CvDocument with PDF FAB", () => {
    render(<CvPage />);

    // ThemeSwitch on page level
    expect(screen.getByTestId("theme-toggle")).toBeDefined();

    // CvDocument and PDF FAB
    expect(screen.getByTestId("cv-document")).toBeDefined();
    expect(screen.getByTestId("fab-pdf")).toBeDefined();
  });
});
