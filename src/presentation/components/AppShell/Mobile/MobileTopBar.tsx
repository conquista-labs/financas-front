import { CalendarDays, LogOut, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useTheme } from "@/App";
import { usePostLogoutGoogle } from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";

import { NAV_ITEMS } from "../appShell.definitions";
import { topBarButton } from "./mobile.styles";

/**
 * Top bar mobile (nova identidade "Nossa Grana"). Sticky, translúcida com blur.
 * Título da tela (derivado da rota) + tema + sair + seletor de mês (placeholder
 * até o mês selecionado virar estado global). Visível só < 900px (lg:hidden).
 */
export const MobileTopBar = () => {
  const { pathname } = useLocation();
  const { darkMode, setDarkMode } = useTheme();
  const { resetState } = useAuthStore();
  const { mutate: logout } = usePostLogoutGoogle();

  const active = NAV_ITEMS.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to),
  );
  const title = active?.label ?? "Nossa Grana";

  const handleLogout = () =>
    logout(undefined, { onSuccess: () => resetState() });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-bg/85 px-[18px] pb-3 pt-4 backdrop-blur-md lg:hidden">
      <span className="font-display text-[20px] font-bold -tracking-[0.02em] text-fg">
        {title}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Tema claro" : "Tema escuro"}
          className={topBarButton()}
        >
          {darkMode ? (
            <Sun className="size-[17px]" strokeWidth={1.9} />
          ) : (
            <Moon className="size-[17px]" strokeWidth={1.9} />
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sair"
          className={topBarButton()}
        >
          <LogOut className="size-[17px]" strokeWidth={1.9} />
        </button>
        <button type="button" className={topBarButton({ shape: "pill" })}>
          <CalendarDays className="size-[15px]" strokeWidth={1.8} />
          Jul
        </button>
      </div>
    </header>
  );
};
