import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CvJuryTable } from "./CvJuryTable";

describe("CvJuryTable Molecule", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the table headers and jury members correctly", () => {
    render(<CvJuryTable />);

    expect(screen.getByText("Nom")).toBeDefined();
    expect(screen.getByText("Titre")).toBeDefined();
    expect(screen.getByText("Institution")).toBeDefined();
    expect(screen.getByText("Rôle")).toBeDefined();

    // Check key members from thesis
    expect(screen.getByText("Hamamache Kheddouci")).toBeDefined();
    expect(screen.getByText("Président")).toBeDefined();
    expect(screen.getByText("Samir Aknine")).toBeDefined();
    expect(screen.getByText("Directeur de thèse")).toBeDefined();
    expect(screen.getByText("Lætitia Matignon")).toBeDefined();
  });
});
