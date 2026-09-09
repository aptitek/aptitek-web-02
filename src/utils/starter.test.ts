import { describe, it, expect } from "vitest";
import { formatAppTitle } from "./starter";

describe("formatAppTitle", () => {
  it("formats title in uppercase correctly", () => {
    const formatted = formatAppTitle("aptitek-02");
    expect(formatted).toBe("APTITEK-02");
  });

  it("handles empty title fallback", () => {
    const formatted = formatAppTitle("   ");
    expect(formatted).toBe("UNTITLED");
  });
});
