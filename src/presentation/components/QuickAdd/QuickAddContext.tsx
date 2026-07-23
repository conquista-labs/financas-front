import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface QuickAddContextValue {
  open: boolean;
  openQuickAdd: () => void;
  closeQuickAdd: () => void;
  setOpen: (open: boolean) => void;
}

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

/**
 * Estado global do modal de Lançamento Rápido — permite abri-lo de qualquer
 * lugar (botão "Nova" em Transações, "Lançar" na sidebar, FAB mobile).
 */
export const QuickAddProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const openQuickAdd = useCallback(() => setOpen(true), []);
  const closeQuickAdd = useCallback(() => setOpen(false), []);

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
