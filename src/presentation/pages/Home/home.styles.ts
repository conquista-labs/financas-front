import { cva } from "class-variance-authority";

/** Painel padrão da dash (card com borda, radius 20). */
export const panel = cva(
  "rounded-card border border-line bg-card p-[22px] sm:px-6",
);

/** Botão do seletor de mês (‹ ›). */
export const monthNavButton = cva(
  "grid size-[38px] place-items-center rounded-[11px] border border-line bg-card text-fg2 transition-colors hover:border-primary/40",
);

/** Botão do switch segmentado (Visão geral / Análises). */
export const segButton = cva(
  "rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors",
  {
    variants: {
      active: {
        true: "bg-card text-primary shadow-[0_2px_6px_rgba(0,0,0,.08)]",
        false: "bg-transparent text-muted hover:text-fg2",
      },
    },
    defaultVariants: { active: false },
  },
);

/** Chip de % gasto na tabela do ano (limiares do protótipo). */
export const spentChip = cva(
  "inline-block rounded-pill px-[9px] py-[2px] text-[11px] font-bold",
  {
    variants: {
      level: {
        over: "bg-danger/10 text-danger", // > 100%
        warn: "bg-warning/10 text-warning", // >= 95%
        ok: "bg-success/10 text-success", // < 95%
      },
    },
    defaultVariants: { level: "ok" },
  },
);
