import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("GIVEN a FormHeader component", () => {
  const title = "Test Title";
  const subtitle = "Test Subtitle";

  describe("WHEN rendered", () => {
    it("THEN should display the correct title text", () => {
      render(<Header title={title} subtitle={subtitle} />);

      const titleElement = screen.getByText(title);
      expect(titleElement).toBeDefined();
    });

    it("THEN should display the correct subtitle text", () => {
      render(<Header title={title} subtitle={subtitle} />);

      const subtitleElement = screen.getByText(subtitle);
      expect(subtitleElement).toBeDefined();
    });
  });
});
