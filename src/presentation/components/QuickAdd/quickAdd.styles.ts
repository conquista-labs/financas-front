import { cva } from "class-variance-authority";

/**
 * Estilos do Lançar (⌘K) do "Repaginado" — valores do protótipo
 * (prototipo/v2/Lancar.dc.html), com tokens do tema para funcionar no escuro.
 */

/** Grupo de segmento (Despesa/Receita, Já paga/A pagar, Único/Mensal/Parcelar). */
export const segGroup = "flex gap-1 rounded-[12px] bg-track p-1";

/** Botão de um segmento; a cor do ativo vem por `tone`. */
export const segButton = cva(
  "h-[34px] flex-1 rounded-[9px] px-3 text-[13px] font-bold transition-colors",
  {
    variants: {
      active: {
        true: "bg-card shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        false: "bg-transparent text-fg2 hover:text-fg",
      },
      tone: {
        danger: "",
        success: "",
        warning: "",
        primary: "",
      },
    },
    compoundVariants: [
      { active: true, tone: "danger", className: "text-danger" },
      { active: true, tone: "success", className: "text-success" },
      { active: true, tone: "warning", className: "text-warning" },
      { active: true, tone: "primary", className: "text-primary" },
    ],
    defaultVariants: { tone: "primary" },
  },
);

/** Pílulas de "o que entendi" da frase (tipo, valor, categoria…). */
export const tokenChip = cva(
  "rounded-full px-[10px] py-[5px] text-[13px] font-bold",
  {
    variants: {
      tone: {
        danger: "bg-danger/10 text-danger",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        primary: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
        neutral: "bg-track text-fg2",
        strong: "bg-fg text-card",
      },
    },
  },
);

/** Chip de categoria / pessoa. */
export const pickChip = cva(
  "flex h-[34px] items-center gap-[7px] rounded-full border px-3 text-[13px] font-semibold transition-colors",
  {
    variants: {
      active: {
        true: "border-primary bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
        false: "border-line bg-card text-fg hover:border-primary/40",
      },
    },
  },
);

/** Rótulo pequeno acima dos campos. */
export const fieldLabel = "text-xs font-semibold text-fg2";

/** Input simples (descrição, tags, observações). */
export const fieldInput =
  "h-[38px] w-full rounded-[10px] border border-line bg-card px-[10px] text-[13.5px] text-fg outline-none placeholder:text-muted focus:border-primary";
