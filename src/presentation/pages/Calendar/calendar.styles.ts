import { cva } from "class-variance-authority";

/** Botão do switch segmentado (Lançamentos / Contas a pagar). */
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

/** Célula de um dia da grade. */
export const dayCell = cva(
  "relative flex min-h-[112px] flex-col gap-[3px] overflow-hidden rounded-[12px] border p-2 text-left transition-colors",
  {
    variants: {
      today: {
        true: "border-primary bg-primary-soft",
        false: "border-line",
      },
      weekend: { true: "bg-bg", false: "bg-card" },
    },
    compoundVariants: [
      { today: false, weekend: false, class: "bg-card" },
      { today: false, weekend: true, class: "bg-bg" },
    ],
    defaultVariants: { today: false, weekend: false },
  },
);
