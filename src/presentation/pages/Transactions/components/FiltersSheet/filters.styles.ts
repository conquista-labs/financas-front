import { cva } from "class-variance-authority";

/**
 * Estilos do painel de filtros (cva). Valores 1:1 do protótipo:
 * pillStyle (Tipo), chipStyle (Categoria), selectStyle (selects/date).
 */

/** Pílula do toggle Tipo (Despesas/Receitas). */
export const filterPill = cva(
  "flex-1 rounded-[11px] border p-[11px] text-[13.5px] font-semibold transition-all",
  {
    variants: {
      active: {
        true: "border-primary bg-primary-soft text-primary-strong",
        false: "border-line bg-card text-fg2 hover:border-primary/40",
      },
    },
  },
);

/** Chip de categoria (com bolinha de cor). */
export const filterChip = cva(
  "flex items-center gap-2 rounded-pill border px-[14px] py-[9px] text-[13px] font-semibold transition-all",
  {
    variants: {
      active: {
        true: "border-primary bg-primary-soft text-primary-strong",
        false: "border-line bg-card text-fg2 hover:border-primary/40",
      },
    },
  },
);

/** Label de cada campo. */
export const filterLabel = cva(
  "mb-[9px] block text-[12.5px] font-semibold text-muted",
);
