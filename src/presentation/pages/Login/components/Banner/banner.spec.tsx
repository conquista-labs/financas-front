import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Banner from "./Banner";

describe("GIVEN a Banner component", () => {
  describe("WHEN rendered", () => {
    it("THEN should display the correct element", () => {
      render(<Banner />);

      const bannerElem = screen.getByTestId("banner-box");
      expect(bannerElem).toBeDefined();
    });

    it("THEN should display the correct children text", () => {
      render(<Banner />);

      expect(
        screen.getByText("Cuidar do que é nosso, todos os dias!"),
      ).toBeDefined();
    });
  });
});
