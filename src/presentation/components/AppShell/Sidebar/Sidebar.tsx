import { ChartNoAxesColumn, LogOut, Moon, Plus } from "lucide-react";

import { useTheme } from "@/App";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui";
import { Separator } from "@/presentation/components/ui/separator";
import { usePostLogoutGoogle } from "@/presentation/hooks/api";
import { useAuthStore } from "@/presentation/store";

import { useQuickAdd } from "../../QuickAdd";
import { NAV_ITEMS } from "../appShell.definitions";
import { useSidebar } from "../useSidebar";
import { aside, iconTile, launchButton, themePill } from "./sidebar.styles";
import { SidebarNavItem } from "./SidebarNavItem";

/**
 * Sidebar desktop da nova identidade "Nossa Grana".
 * Estilos reproduzidos 1:1 do protótipo (design_handoff), extraídos para
 * `sidebar.styles.ts` (cva) e o item de nav para `SidebarNavItem`. Sticky,
 * 252px expandida / 76px recolhida; o botão do logo recolhe/expande.
 */
export const Sidebar = () => {
  const { collapsed, toggle } = useSidebar();
  const { openQuickAdd } = useQuickAdd();
  const { darkMode, setDarkMode } = useTheme();
  const { auth, resetState } = useAuthStore();
  const { mutate: logout, isPending } = usePostLogoutGoogle();

  const user = auth?.user;
  const initials = (user?.nome ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const themeLabel = darkMode ? "Tema claro" : "Tema escuro";

  const handleLogout = () =>
    logout(undefined, { onSuccess: () => resetState() });

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={aside({ collapsed })}>
        {/* Marca — o botão do logo recolhe/expande */}
        <div className="flex items-center gap-[11px] px-1 pb-[22px]">
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            className={iconTile({ tone: "brand" })}
          >
            <ChartNoAxesColumn className="size-[22px]" strokeWidth={2.4} />
          </button>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-[1.05]">
              <span className="font-display text-[17px] font-bold -tracking-[0.02em] text-fg">
                Nossa Grana
              </span>
              <span className="text-[11px] font-medium text-muted">
                controle da casa
              </span>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Botão Lançar — abre o modal de Lançamento Rápido */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Lançar"
                onClick={openQuickAdd}
                className={launchButton({ collapsed })}
              >
                <Plus className="size-[18px]" strokeWidth={2.4} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Lançar</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={openQuickAdd}
            className={launchButton({ collapsed })}
          >
            <Plus className="size-[18px]" strokeWidth={2.4} />
            Lançar
          </button>
        )}

        {/* Toggle de tema — pill bg-track, empurrado ao fundo (mt-auto) */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={themeLabel}
                className={themePill({ collapsed })}
              >
                <Moon className="size-[17px]" strokeWidth={1.9} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{themeLabel}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={themeLabel}
            className={themePill({ collapsed })}
          >
            <Moon className="size-[17px]" strokeWidth={1.9} />
            {themeLabel}
          </button>
        )}

        {/* Divisória entre tema e usuário (protótipo: border-top var(--line)) */}
        <Separator className="mt-[14px] bg-line" />

        {/* Rodapé: usuário + Sair */}
        <div
          className={`flex items-center gap-[11px] px-[6px] py-3 ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <div className="grid size-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-[#9B7BEA] text-[13px] font-semibold text-white">
            {initials}
          </div>
          {!collapsed && (
            <>
              <div className="flex min-w-0 flex-1 flex-col leading-[1.15]">
                <span className="truncate text-[13.5px] font-semibold text-fg">
                  {user?.nome ?? "Usuário"}
                </span>
                <span className="truncate text-[11.5px] text-muted">
                  conta compartilhada
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                aria-label="Sair"
                className={iconTile({ tone: "track", size: "sm" })}
              >
                <LogOut className="size-[17px]" strokeWidth={1.9} />
              </button>
            </>
          )}
        </div>

        {/* Sair (recolhido) — botão isolado abaixo do avatar */}
        {collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                aria-label="Sair"
                className={`mt-2 self-center ${iconTile({ tone: "track" })}`}
              >
                <LogOut className="size-[18px]" strokeWidth={1.9} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        )}
      </aside>
    </TooltipProvider>
  );
};
