import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginForm from "./Form";

describe("LoginForm", () => {
  it("deve renderizar corretamente o formulário de login", () => {
    render(<LoginForm />);

    expect(screen.getByText("Entrar")).toBeInTheDocument();

    expect(screen.getByText(/E-mail do usuário/i)).toBeInTheDocument();

    expect(screen.getByText(/Senha/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });
});
