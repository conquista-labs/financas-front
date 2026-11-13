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

describe("QuickAddProvider — preset", () => {
  const ProbePreset = () => {
    const { open, preset, openQuickAddCom, closeQuickAdd } = useQuickAdd();
    return (
      <>
        <span>{open ? "aberto" : "fechado"}</span>
        <span>preset:{preset?.status ?? "nenhum"}</span>
        <button onClick={() => openQuickAddCom({ status: "pendente" })}>
          nova conta
        </button>
        <button onClick={closeQuickAdd}>fechar</button>
      </>
    );
  };

  it("⌘K depois de um preset abre sem o preset", () => {
    render(
      <QuickAddProvider>
        <ProbePreset />
      </QuickAddProvider>,
    );
    fireEvent.click(screen.getByText("nova conta"));
    expect(screen.getByText("preset:pendente")).toBeInTheDocument();
    fireEvent.click(screen.getByText("fechar"));
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByText("aberto")).toBeInTheDocument();
    expect(screen.getByText("preset:nenhum")).toBeInTheDocument();
  });
});
