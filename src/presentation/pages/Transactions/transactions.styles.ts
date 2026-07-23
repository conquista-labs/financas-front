import { cva } from "class-variance-authority";

/**
 * Estilos da tela de Transações (cva). Valores reproduzidos 1:1 do protótipo
 * (design_handoff). Atenção às armadilhas: despesa usa cor de texto normal
 * (não vermelho); fundo do botão excluir é #FDECEC fixo (não token); badges
 * de parcela/chips usam texto #4536c9 sobre accent-soft.
 */

/**
 * Botão branco da barra de ação (Filtros, Importar). Altura casada com a busca
 * (h-12 = 48px) — no protótipo eles têm a mesma altura, o botão estica.
 */
export const actionButton = cva(
  "flex h-12 shrink-0 items-center gap-2 rounded-[13px] border border-line bg-card px-4 text-sm font-semibold text-fg transition-colors hover:border-primary",
);

/** Botão de ação da linha (editar, duplicar, excluir) — 34x34. */
export const rowAction = cva(
  "grid size-[34px] shrink-0 place-items-center rounded-[10px] transition-colors",
  {
    variants: {
      tone: {
        neutral: "bg-bg text-fg2 hover:bg-line2",
        danger: "bg-[#FDECEC] text-danger hover:brightness-95",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

/** Chip de filtro ativo (removível). */
export const filterChip = cva(
  "flex items-center gap-[7px] rounded-pill bg-primary-soft py-[7px] pl-[13px] pr-2 text-[13px] font-semibold text-primary-strong",
);
