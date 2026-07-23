import { NavLink, useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui";

import type { NavItem } from "../appShell.definitions";
import { navItem } from "./sidebar.styles";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
}

/**
 * Um item de navegação da Sidebar. Encapsula o estado ativo e o tooltip que
 * aparece só quando a sidebar está recolhida.
 *
 * Nota: o `isActive` é derivado de useLocation (não da render-prop do NavLink)
 * porque, quando recolhido, o NavLink vira filho de <TooltipTrigger asChild>,
 * e o Slot do Radix serializa uma `className` em função como string literal —
 * quebrando os estilos. Passar `className` como string resolvida evita isso.
 */
export const SidebarNavItem = ({ item, collapsed }: SidebarNavItemProps) => {
  const { label, to, icon: Icon } = item;
  const { pathname } = useLocation();
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

  const link = (
    <NavLink
      to={to}
      end={to === "/"}
      className={navItem({ collapsed, active: isActive })}
    >
      <Icon className="size-[19px] shrink-0" strokeWidth={1.9} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};
