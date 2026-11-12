import { fireEvent, render, screen } from "@testing-library/react";

import { QuickAddProvider, useQuickAdd } from "./QuickAddContext";

const Probe = () => {
  const { open } = useQuickAdd();
  return <span>{open ? "aberto" : "fechado"}</span>;
};

const renderProvider = () =>
  render(
    <QuickAddProvider>
      <Probe />
    </QuickAddProvider>,
  );

describe("QuickAddProvider — atalho ⌘K", () => {
  it("abre e fecha com ⌘K", () => {
    renderProvider();
    expect(screen.getByText("fechado")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByText("aberto")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByText("fechado")).toBeInTheDocument();
  });

  it("abre com Ctrl+K", () => {
    renderProvider();
    fireEvent.keyDown(window, { key: "K", ctrlKey: true });
    expect(screen.getByText("aberto")).toBeInTheDocument();
  });

  it("ignora K sem modificador e outras combinações", () => {
    renderProvider();
    fireEvent.keyDown(window, { key: "k" });
    fireEvent.keyDown(window, { key: "k", metaKey: true, shiftKey: true });
    expect(screen.getByText("fechado")).toBeInTheDocument();
  });
});
