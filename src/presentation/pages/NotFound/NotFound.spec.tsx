import { render, screen } from "@testing-library/react";

import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders the not found page correctly", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByText("Desculpe, não conseguimos encontrar essa página."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A página que você procura não existe ou foi movida para outro endereço!",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Voltar à página inicial")).toBeInTheDocument();
  });
});
