import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "~/tokens/theme";
import FloatingActionButton from "./FloatingActionButton";

describe("FloatingActionButton Atom", () => {
  it("renders with tooltip and fires onClick", () => {
    const handleClick = vi.fn();
    render(
      <ThemeProvider theme={appTheme}>
        <FloatingActionButton
          tooltip="Create item"
          onClick={handleClick}
          testId="test-fab"
        />
      </ThemeProvider>,
    );

    const btn = screen.getByTestId("test-fab");
    expect(btn).toBeDefined();
    expect(btn.getAttribute("aria-label")).toBe("Create item");

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as an anchor link when href is provided", () => {
    render(
      <ThemeProvider theme={appTheme}>
        <FloatingActionButton
          tooltip="Download PDF"
          href="/cv.pdf"
          target="_blank"
          testId="test-fab-link"
        />
      </ThemeProvider>,
    );

    const link = screen.getByTestId("test-fab-link");
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link.getAttribute("href")).toBe("/cv.pdf");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
