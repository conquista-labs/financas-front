import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useQuickAdd } from "../../QuickAdd";
import { TAB_ITEMS } from "../appShell.definitions";
import { tabItem } from "./mobile.styles";

/**
 * Bottom tab bar mobile (nova identidade "Nossa Grana"). Fixa no rodapé, com
 * blur, 4 itens de rota (Início, Extrato, Agenda, Patri.) e o FAB central
 * "Lançar" elevado. Visível só < 900px (lg:hidden). O FAB é placeholder até o
 * modal de Lançamento Rápido existir (etapa de Transações).
 */
export const MobileTabBar = () => {
  const { openQuickAdd } = useQuickAdd();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-card/90 px-[6px] pt-[9px] backdrop-blur-md [padding-bottom:calc(9px+env(safe-area-inset-bottom))] lg:hidden">
      <NavLink
        to={TAB_ITEMS[0].to}
        end
        className={({ isActive }) => tabItem({ active: isActive })}
      >
        <TabIcon item={TAB_ITEMS[0]} />
      </NavLink>
      <NavLink
        to={TAB_ITEMS[1].to}
        className={({ isActive }) => tabItem({ active: isActive })}
      >
        <TabIcon item={TAB_ITEMS[1]} />
      </NavLink>

      {/* FAB central "Lançar" — abre o Lançamento Rápido */}
      <button
        type="button"
        aria-label="Lançar"
        onClick={openQuickAdd}
        className="-mt-6 flex size-[54px] items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_24px_-8px_rgba(91,75,224,0.9)]"
      >
        <Plus className="size-[26px]" strokeWidth={2.6} />
      </button>

      <NavLink
        to={TAB_ITEMS[2].to}
        className={({ isActive }) => tabItem({ active: isActive })}
      >
        <TabIcon item={TAB_ITEMS[2]} />
      </NavLink>
      <NavLink
        to={TAB_ITEMS[3].to}
        className={({ isActive }) => tabItem({ active: isActive })}
      >
        <TabIcon item={TAB_ITEMS[3]} />
      </NavLink>
    </nav>
  );
};

const TabIcon = ({ item }: { item: (typeof TAB_ITEMS)[number] }) => {
  const { icon: Icon, label } = item;
  return (
    <>
      <Icon className="size-[22px]" strokeWidth={1.9} />
      <span>{label}</span>
    </>
  );
};
