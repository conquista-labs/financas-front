import {
  ArrowLeftRight,
  Box,
  CalendarDays,
  Landmark,
  LayoutDashboard,
  type LucideIcon,
  Upload,
} from "lucide-react";

import { urlRouters } from "@/presentation/router/router.definitions";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  /** Rota ainda não implementada (placeholder visual, ex.: Importar/Etapa 3). */
  soon?: boolean;
}

/**
 * Itens de navegação da Sidebar (nova identidade "Nossa Grana"), fiéis ao
 * protótipo: Visão geral, Transações, Calendário, Patrimônio, Cadastros
 * (agrupa Categorias/Pessoas/Meios), Importar. Ícones do lucide-react.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Visão geral",
    to: urlRouters.home,
    icon: LayoutDashboard,
  },
  {
    id: "transactions",
    label: "Transações",
    to: urlRouters.transactions,
    icon: ArrowLeftRight,
  },
  {
    id: "calendar",
    label: "Calendário",
    to: urlRouters.calendar,
    icon: CalendarDays,
  },
  {
    id: "patrimony",
    label: "Patrimônio",
    to: urlRouters.patrimony,
    icon: Landmark,
  },
  {
    id: "registers",
    label: "Cadastros",
    to: urlRouters.registers,
    icon: Box,
  },
  {
    id: "import",
    label: "Importar",
    to: urlRouters.import,
    icon: Upload,
  },
];

/**
 * Itens da bottom tab bar mobile (fiéis ao protótipo): Início, Extrato, Agenda,
 * Patri. — labels curtos. O FAB central (Lançar) não é um item de rota; fica
 * no meio da barra, renderizado à parte.
 */
export const TAB_ITEMS: NavItem[] = [
  { id: "home", label: "Início", to: urlRouters.home, icon: LayoutDashboard },
  {
    id: "transactions",
    label: "Extrato",
    to: urlRouters.transactions,
    icon: ArrowLeftRight,
  },
  {
    id: "calendar",
    label: "Agenda",
    to: urlRouters.calendar,
    icon: CalendarDays,
  },
  {
    id: "patrimony",
    label: "Patri.",
    to: urlRouters.patrimony,
    icon: Landmark,
  },
];
