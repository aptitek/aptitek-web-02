import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CvSkillTag } from "./CvSkillTag";

describe("CvSkillTag Atom", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders label and count properly", () => {
    render(<CvSkillTag id="ai" label="IA & LLM" count={5} />);

    expect(screen.getByText("IA & LLM")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });

  it("triggers onClick callback with skill ID when clicked", () => {
    const handleClick = vi.fn();
    render(<CvSkillTag id="python" label="Python" onClick={handleClick} />);

    const button = screen.getByTestId("skill-tag-python");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith("python");
  });

  it("reflects active state via aria-pressed", () => {
    const { rerender } = render(
      <CvSkillTag id="linux" label="Linux" isActive={false} />,
    );
    expect(
      screen.getByTestId("skill-tag-linux").getAttribute("aria-pressed"),
    ).toBe("false");

    rerender(<CvSkillTag id="linux" label="Linux" isActive={true} />);
    expect(
      screen.getByTestId("skill-tag-linux").getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
