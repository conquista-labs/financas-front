import { LogOut, Moon, Search, Sun } from "lucide-react";
import type { ReactElement } from "react";

import { useTheme } from "@/App";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui";
import {
  useGetCaixaEntradaResumo,
  usePostLogoutGoogle,
} from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";

import { QUICK_ADD_SHORTCUT_LABEL, useQuickAdd } from "../../QuickAdd";
import { NAV_ITEMS, type NavBadge } from "../appShell.definitions";
import { useSidebar } from "../useSidebar";
import { aside, brandTile, footerButton, searchBar } from "./sidebar.styles";
import { SidebarNavItem } from "./SidebarNavItem";

/** Envolve o controle num tooltip à direita só quando a sidebar está recolhida. */
const WithTooltip = ({
  show,
  label,
  children,
}: {
  show: boolean;
  label: string;
  children: ReactElement;
}) =>
  show ? (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    children
  );

/**
 * Sidebar desktop do "Repaginado" (prototipo/v2): escura nos dois temas,
 * marca "N", barra "Buscar ou lançar ⌘K", 7 itens e rodapé com usuário,
 * tema e sair numa linha. Sticky, 232px expandida / 76px recolhida; o
 * quadrado da marca recolhe/expande.
 */
export const Sidebar = () => {
  const { collapsed, toggle } = useSidebar();
  const { openQuickAdd } = useQuickAdd();
  const { darkMode, setDarkMode } = useTheme();
  const { auth, resetState } = useAuthStore();
  const { mutate: logout, isPending } = usePostLogoutGoogle();
  // Pendentes da fila de revisão — atualiza a cada 2 min e ao voltar à aba.
  const { data: resumo } = useGetCaixaEntradaResumo({
    refetchInterval: 2 * 60 * 1000,
  });
  const counts: Record<NavBadge, number | undefined> = {
    revisar: resumo?.data.pendentes,
  };

  const user = auth?.user;
  const fullName = user?.nome ?? "Usuário";
  const firstName = fullName.split(" ")[0];
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const themeLabel = darkMode ? "Tema claro" : "Tema escuro";
  const ThemeIcon = darkMode ? Sun : Moon;
  const searchLabel = `Buscar ou lançar (${QUICK_ADD_SHORTCUT_LABEL})`;

  const handleLogout = () =>
    logout(undefined, { onSuccess: () => resetState() });

  const themeButton = (
    <WithTooltip show={collapsed} label={themeLabel}>
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={themeLabel}
        title={collapsed ? undefined : themeLabel}
        className={footerButton}
      >
        <ThemeIcon className="size-[17px]" strokeWidth={2} />
      </button>
    </WithTooltip>
  );

  const logoutButton = (
    <WithTooltip show={collapsed} label="Sair">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        aria-label="Sair"
        title={collapsed ? undefined : "Sair"}
        className={footerButton}
      >
        <LogOut className="size-4" strokeWidth={2} />
      </button>
    </WithTooltip>
  );

  const avatar = (
    <div
      aria-hidden={!collapsed}
      title={collapsed ? fullName : undefined}
      className="grid size-[34px] shrink-0 place-items-center rounded-full bg-sidebar-avatar text-[13px] font-semibold text-sidebar-avatar-fg"
    >
      {initials}
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={aside({ collapsed })}>
        {/* Marca — o quadrado "N" recolhe/expande */}
        <div
          className={`flex items-center gap-[10px] pb-[18px] pt-[2px] ${
            collapsed ? "justify-center" : "px-2"
          }`}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className={brandTile}
          >
            N
          </button>
          {!collapsed && (
            <span className="truncate font-display text-lg font-bold text-sidebar-fg">
              Nossa Grana
            </span>
          )}
        </div>

        {/* Buscar ou lançar — abre o Lançar (⌘K) */}
        <WithTooltip show={collapsed} label={searchLabel}>
          <button
            type="button"
            aria-label={collapsed ? searchLabel : undefined}
            onClick={openQuickAdd}
            className={searchBar({ collapsed })}
          >
            <Search className="size-4 shrink-0" strokeWidth={2} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Buscar ou lançar</span>
                <kbd className="rounded-[6px] bg-white/[0.12] px-[6px] py-[2px] font-sans text-[11.5px]">
                  {QUICK_ADD_SHORTCUT_LABEL}
                </kbd>
              </>
            )}
          </button>
        </WithTooltip>

        {/* Navegação */}
        <nav aria-label="Navegação principal" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              count={item.badge ? counts[item.badge] : undefined}
            />
          ))}
        </nav>

        <div className="min-h-5 flex-1" />

        {/* Rodapé: usuário, tema e sair */}
        <div
          className={`flex border-t border-white/10 pt-[14px] ${
            collapsed
              ? "flex-col items-center gap-2"
              : "items-center gap-2 px-1"
          }`}
        >
          {avatar}
          {!collapsed && (
            <p className="min-w-0 flex-1 truncate text-sm font-semibold leading-tight text-sidebar-fg">
              {firstName}
            </p>
          )}
          {themeButton}
          {logoutButton}
        </div>
      </aside>
    </TooltipProvider>
  );
};
