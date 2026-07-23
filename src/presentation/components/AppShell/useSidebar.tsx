import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "sidebar-collapsed";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Estado de recolhimento da Sidebar (nova identidade "Nossa Grana").
 * Persiste a preferência em localStorage["sidebar-collapsed"], espelhando o
 * padrão do tema (localStorage["dark-theme"]).
 */
export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsedState] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const setCollapsed = useCallback(
    (value: boolean) => setCollapsedState(value),
    [],
  );
  const toggle = useCallback(() => setCollapsedState((prev) => !prev), []);

  const value = useMemo(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle, setCollapsed],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de <SidebarProvider>");
  }
  return context;
};
