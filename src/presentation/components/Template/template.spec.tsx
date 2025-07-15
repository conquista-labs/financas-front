import type { MemoryRouterProps } from "react-router-dom";
import { describe, it } from "vitest";

import { renderWithQuery } from "@/presentation/mocks";
import { urlRouters } from "@/presentation/router";

import Template from "./Template";

const history = {
  initialEntries: [urlRouters.root],
} satisfies MemoryRouterProps;

const makeSut = (children: React.ReactNode) => {
  return renderWithQuery({
    history,
    Page: () => <Template>{children}</Template>,
  });
};

describe("Template Component", () => {
  it("deve renderizar o layout principal com os filhos", () => {
    makeSut(<div>children</div>);
  });
});
