import { cva } from "class-variance-authority";

/** Aba do hub de Cadastros (ativa = roxa cheia; inativa = card com borda). */
export const registerTab = cva(
  "rounded-[12px] border px-[18px] py-[11px] text-sm font-semibold transition-colors",
  {
    variants: {
      active: {
        true: "border-primary bg-primary text-white",
        false: "border-line bg-card text-fg2 hover:border-primary/40",
      },
    },
    defaultVariants: { active: false },
  },
);

/** Botão de ação da linha/card (estrela e editar). Excluir tem estilo próprio. */
export const rowAction = cva(
  "grid place-items-center rounded-[9px] border-none bg-bg text-fg2 transition-colors hover:bg-track",
  {
    variants: {
      size: {
        md: "size-8",
        sm: "size-[30px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** Badge de tipo de categoria (Despesa/Receita). */
export const typeBadge = cva(
  "rounded-[20px] px-[11px] py-1 text-[11px] font-bold",
  {
    variants: {
      tipo: {
        despesa: "bg-danger/10 text-danger",
        receita: "bg-success/10 text-success",
      },
    },
  },
);
