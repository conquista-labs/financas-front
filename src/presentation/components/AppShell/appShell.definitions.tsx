import {
  ArrowLeftRight,
  CalendarDays,
  Ellipsis,
  House,
  Inbox,
  Landmark,
  type LucideIcon,
  Settings,
  Target,
} from "lucide-react";

import { urlRouters } from "@/presentation/router/router.definitions";

/** Contadores que um item de navegação pode exibir ao lado do label. */
export type NavBadge = "revisar" | "agenda";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  /** Rota ainda não implementada (placeholder visual, ex.: Importar/Etapa 3). */
  soon?: boolean;
  /** Contador ao lado do label (ex.: itens pendentes em Revisar). */
  badge?: NavBadge;
}

/**
 * Itens de navegação da Sidebar no "Repaginado": menos telas, cada uma
 * resolvendo mais. Visão geral → Início; Caixa de entrada + Importar →
 * Revisar; Calendário → Agenda; Cadastros → Ajustes.
 */
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Início", to: urlRouters.home, icon: House },
  {
    id: "transactions",
    label: "Transações",
    to: urlRouters.transactions,
    icon: ArrowLeftRight,
  },
  {
    id: "revisar",
    label: "Revisar",
    to: urlRouters.revisar,
    icon: Inbox,
    badge: "revisar",
  },
  {
    id: "agenda",
    label: "Agenda",
    to: urlRouters.agenda,
    icon: CalendarDays,
    badge: "agenda",
  },
  {
    id: "patrimony",
    label: "Patrimônio",
    to: urlRouters.patrimony,
    icon: Landmark,
  },
  { id: "goals", label: "Metas", to: urlRouters.goals, icon: Target },
  { id: "ajustes", label: "Ajustes", to: urlRouters.ajustes, icon: Settings },
];

/**
 * Itens da barra inferior mobile (Repaginado): Início, Transações, Revisar e
 * Mais. O "Lançar" (+) fica no meio, renderizado à parte; o resto das telas
 * (Agenda, Patrimônio, Metas, Ajustes) mora no "Mais".
 */
export const TAB_ITEMS: NavItem[] = [
  { id: "home", label: "Início", to: urlRouters.home, icon: House },
  {
    id: "transactions",
    label: "Transações",
    to: urlRouters.transactions,
    icon: ArrowLeftRight,
  },
  {
    id: "revisar",
    label: "Revisar",
    to: urlRouters.revisar,
    icon: Inbox,
    badge: "revisar",
  },
  { id: "mais", label: "Mais", to: urlRouters.mais, icon: Ellipsis },
];

/** Telas que ficam dentro do "Mais" (a aba "Mais" acende nelas). */
export const ROTAS_DO_MAIS = [
  urlRouters.mais,
  urlRouters.agenda,
  urlRouters.patrimony,
  urlRouters.goals,
  urlRouters.ajustes,
];
