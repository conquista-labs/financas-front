import { screen } from "@testing-library/react";
import type { MemoryRouterProps } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithQuery } from "@/presentation/mocks";
import { urlRouters } from "@/presentation/router";

import Home from "./Home";

const history = {
  initialEntries: [urlRouters.root],
} satisfies MemoryRouterProps;

const makeSut = () => {
  return renderWithQuery({
    history,
    Page: () => <Home />,
  });
};

describe("Home page", () => {
  it("should render the title of the page", () => {
    makeSut();
    expect(screen.getByText("Bem-vindo ao Tria")).toBeInTheDocument();
  });

  it("should render the card title", () => {
    makeSut();
    expect(screen.getByText("Reembolsos inteligentes")).toBeInTheDocument();
  });
});
