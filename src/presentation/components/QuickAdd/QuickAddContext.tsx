import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface QuickAddContextValue {
  open: boolean;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  setOpen: (open: boolean) => void;
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Atalho do Lançar como aparece na tela: "⌘K" no Mac, "Ctrl K" no resto. */
export const QUICK_ADD_SHORTCUT_LABEL = isMac ? "⌘K" : "Ctrl K";

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

/**
 * Estado global do modal de Lançamento Rápido — permite abri-lo de qualquer
 * lugar (botão "Nova" em Transações, "Buscar ou lançar" na sidebar, ⌘K,
 * FAB mobile).
 */
export const QuickAddProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const openQuickAdd = useCallback(() => setOpen(true), []);
  const closeQuickAdd = useCallback(() => setOpen(false), []);

  // ⌘K / Ctrl+K abre (ou fecha) o Lançar de qualquer tela.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey)
        return;
      event.preventDefault();
      setOpen((current) => !current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({ open, openQuickAdd, closeQuickAdd, setOpen }),
    [open, openQuickAdd, closeQuickAdd],
  );

  return (
    <QuickAddContext.Provider value={value}>
      {children}
    </QuickAddContext.Provider>
  );
};

export const useQuickAdd = (): QuickAddContextValue => {
  const ctx = useContext(QuickAddContext);
  if (!ctx)
    throw new Error("useQuickAdd deve ser usado dentro de <QuickAddProvider>");
  return ctx;
};
