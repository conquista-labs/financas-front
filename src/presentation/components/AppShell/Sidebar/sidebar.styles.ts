import { cva } from "class-variance-authority";

/**
 * Variantes de estilo da Sidebar (cva). Extrai os grupos de classe recorrentes
 * do JSX, mantendo o Tailwind embaixo mas com nomes e type-safety. Padrão do
 * rebrand: componentes com muitas classes ganham um `.styles.ts` colocalizado.
 *
 * Valores do protótipo "Repaginado" (prototipo/v2/Inicio.dc.html → <nav>):
 * sidebar escura nos dois temas, 232px, itens de 44px, ativo em roxo cheio.
 */

export const aside = cva(
  "sticky top-0 hidden h-screen shrink-0 flex-col gap-1 bg-sidebar py-[22px] text-sidebar-fg shadow-[inset_-1px_0_0_rgb(var(--sidebar-edge))] transition-[width] duration-200 ease-out lg:flex",
  {
    variants: {
      collapsed: {
        true: "w-[76px] px-3",
        false: "w-[232px] px-[14px]",
      },
    },
  },
);

export const navItem = cva(
  "flex min-h-11 w-full items-center rounded-[12px] text-[14.5px] font-semibold transition-colors",
  {
    variants: {
      collapsed: {
        true: "justify-center px-0",
        false: "justify-start gap-3 px-3",
      },
      active: {
        true: "bg-primary text-white",
        false: "text-sidebar-fg2 hover:bg-white/[0.06] hover:text-sidebar-fg",
      },
    },
  },
);

/** Pílula do contador ao lado do label (ex.: pendentes em Revisar). */
export const navCount =
  "flex h-5 min-w-[22px] items-center justify-center rounded-full bg-white px-[6px] text-[11.5px] font-bold tabular-nums text-sidebar";

/** Barra "Buscar ou lançar" — abre o Lançar (⌘K) de qualquer tela. */
export const searchBar = cva(
  "mb-3 flex h-11 items-center rounded-[12px] bg-white/[0.08] text-sidebar-fg3 transition-colors hover:bg-white/[0.12]",
  {
    variants: {
      collapsed: {
        true: "justify-center",
        false: "gap-[10px] px-3 text-sm",
      },
    },
  },
);

/** Botões-ícone do rodapé (tema, sair): 32px, fundo transparente. */
export const footerButton =
  "grid size-8 shrink-0 place-items-center rounded-[10px] text-sidebar-fg3 transition-colors hover:bg-white/[0.08] hover:text-sidebar-fg disabled:opacity-50";

/** Quadrado da marca ("N"); também recolhe/expande a sidebar. */
export const brandTile =
  "grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-primary font-display text-base font-bold text-white transition-transform hover:scale-105";
