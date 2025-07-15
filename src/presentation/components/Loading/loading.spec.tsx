import { render, screen } from "@testing-library/react";

import Loading from "./Loading";

describe("Loading", () => {
  it("deve renderizar o spinner quando isLoading for true", () => {
    render(<Loading isLoading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("não deve renderizar nada quando isLoading for false", () => {
    const { container } = render(<Loading isLoading={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});
