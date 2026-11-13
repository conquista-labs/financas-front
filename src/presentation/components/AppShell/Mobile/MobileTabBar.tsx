import { Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { useQuickAdd } from "../../QuickAdd";
import {
  type NavItem,
  ROTAS_DO_MAIS,
  TAB_ITEMS,
} from "../appShell.definitions";
import { useNavCounts } from "../useNavCounts";

/**
 * Barra inferior mobile do "Repaginado": escura e flutuante (nos dois temas),
 * com Início, Transações, o "+" de Lançar no meio, Revisar (com contador) e
 * Mais. Visível só abaixo de lg.
 */
export const MobileTabBar = () => {
  const { openQuickAdd } = useQuickAdd();
  const { pathname } = useLocation();
  const counts = useNavCounts();

  const ativo = (item: NavItem) =>
    item.id === "mais"
      ? ROTAS_DO_MAIS.some((r) => pathname.startsWith(r))
      : item.to === "/"
        ? pathname === "/"
        : pathname.startsWith(item.to);

  const aba = (item: NavItem) => {
    const n = item.badge ? counts[item.badge] : undefined;
    const on = ativo(item);
    return (
      <NavLink
        key={item.id}
        to={item.to}
        aria-current={on ? "page" : undefined}
        aria-label={n ? `${item.label} (${n})` : item.label}
        className={cn(
          "relative flex min-h-12 flex-col items-center justify-center gap-[3px] text-[10.5px] font-semibold transition-colors",
          on ? "text-white" : "text-[#8E8A9C]",
        )}
      >
        <item.icon className="size-[21px]" strokeWidth={on ? 2.2 : 1.9} />
        <span>{item.label}</span>
        {!!n && (
          <span className="absolute left-1/2 top-[2px] ml-[6px] min-w-[18px] rounded-full bg-white px-[5px] text-center text-[10px] font-bold leading-[16px] text-[#16151C]">
            {n > 99 ? "99+" : n}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <nav
      aria-label="Navegação"
      className="fixed inset-x-3 z-40 grid h-[68px] grid-cols-5 items-center rounded-[24px] bg-sidebar shadow-[0_18px_40px_-16px_rgba(23,22,27,.6)] [bottom:calc(12px+env(safe-area-inset-bottom))] dark:shadow-[inset_0_0_0_1px_#2B2A34] lg:hidden"
    >
      {TAB_ITEMS.slice(0, 2).map(aba)}
      <button
        type="button"
        aria-label="Lançar"
        onClick={openQuickAdd}
        className="mx-auto grid size-[52px] place-items-center rounded-[18px] bg-primary text-white transition-colors hover:bg-primary-strong"
      >
        <Plus className="size-[26px]" strokeWidth={2.6} />
      </button>
      {TAB_ITEMS.slice(2).map(aba)}
    </nav>
  );
};
