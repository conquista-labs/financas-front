import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { MemoryRouter } from "react-router-dom";

import { SidebarNavItem } from "./SidebarNavItem";

const item = { id: "revisar", label: "Revisar", to: "/revisar", icon: Inbox };

const renderItem = (count?: number) =>
  render(
    <MemoryRouter>
      <SidebarNavItem item={item} collapsed={false} count={count} />
    </MemoryRouter>,
  );

describe("SidebarNavItem", () => {
  it("mostra o contador quando há pendentes", () => {
    renderItem(30);
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Revisar, 30 pendentes" }),
    ).toBeInTheDocument();
  });

  it("limita o contador a 99+", () => {
    renderItem(150);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("esconde o contador quando é zero ou não veio", () => {
    const { rerender } = renderItem(0);
    expect(screen.getByRole("link", { name: "Revisar" })).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <SidebarNavItem item={item} collapsed={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
