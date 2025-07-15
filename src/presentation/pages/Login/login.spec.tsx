import { screen } from "@testing-library/react";
import type { MemoryRouterProps } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithQuery } from "@/presentation/mocks";
import { urlRouters } from "@/presentation/router";

import Login from "./Login";

const history = {
  initialEntries: [urlRouters.login],
} satisfies MemoryRouterProps;

const makeSut = () => {
  return renderWithQuery({
    history,
    Page: () => <Login />,
  });
};

describe("Login page", () => {
  it("deve renderizar o layout de login com o formulário e imagem", () => {
    makeSut();

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
