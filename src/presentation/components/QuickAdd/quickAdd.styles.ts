import { cva } from "class-variance-authority";

/**
 * Estilos do modal de Lançamento Rápido (cva). Valores 1:1 do protótipo:
 * segStyle (toggle tipo), pillStyle (repetição), chipStyle (categoria/pessoa).
 */

/** Botão do segment de tipo (Despesa/Receita) — fundo track, pílula ativa. */
export const segButton = cva(
  "flex-1 rounded-[10px] px-[14px] py-[10px] text-sm font-semibold transition-all",
  {
    variants: {
      active: {
        true: "bg-card shadow-[0_2px_6px_rgba(0,0,0,0.08)]",
        false: "bg-transparent text-muted",
      },
    },
  },
);

/** Pílula de repetição (Único/Mensal/Parcelar). */
export const repeatPill = cva(
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

/** Chip de categoria/pessoa (com bolinha ou estrela de favorito). */
export const quickChip = cva(
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

/** Campo de texto do modal (descrição, tag). */
export const quickInput = cva(
  "w-full rounded-[12px] border border-line bg-card px-[13px] py-3 text-sm text-fg outline-none placeholder:text-muted",
);
