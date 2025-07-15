import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Header } from "@/presentation/components";

const makeSut = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe("Header component", () => {
  it("should render Header", () => {
    makeSut();

    const item = screen.getByTestId("header");
    expect(item).toBeInTheDocument();
  });
});
