import { NavLink, useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui";

import type { NavItem } from "../appShell.definitions";
import { navCount, navItem } from "./sidebar.styles";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  /** Contador ao lado do label; oculto quando 0 ou ausente. */
  count?: number;
}

/** "99+" acima de 99 para não estourar a pílula. */
const formatCount = (count: number) => (count > 99 ? "99+" : String(count));

/**
 * Um item de navegação da Sidebar. Encapsula o estado ativo e o tooltip que
 * aparece só quando a sidebar está recolhida.
 *
 * Nota: o `isActive` é derivado de useLocation (não da render-prop do NavLink)
 * porque, quando recolhido, o NavLink vira filho de <TooltipTrigger asChild>,
 * e o Slot do Radix serializa uma `className` em função como string literal —
 * quebrando os estilos. Passar `className` como string resolvida evita isso.
 */
export const SidebarNavItem = ({
  item,
  collapsed,
  count,
}: SidebarNavItemProps) => {
  const { label, to, icon: Icon } = item;
  const { pathname } = useLocation();
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
  const pending = count ?? 0;
  const showCount = pending > 0;
  const tooltipLabel = showCount ? `${label} (${pending})` : label;

  const link = (
    <NavLink
      to={to}
      end={to === "/"}
      aria-label={showCount ? `${label}, ${pending} pendentes` : undefined}
      className={navItem({ collapsed, active: isActive })}
    >
      <span className="relative shrink-0">
        <Icon className="size-[18px]" strokeWidth={1.9} />
        {collapsed && showCount && (
          <span
            aria-hidden
            className="absolute -right-1 -top-1 size-2 rounded-full bg-white ring-2 ring-sidebar"
          />
        )}
      </span>
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && showCount && (
        <span aria-hidden className={navCount}>
          {formatCount(pending)}
        </span>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
};
