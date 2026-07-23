import { cva } from "class-variance-authority";

/**
 * Variantes de estilo do shell mobile (cva). Valores reproduzidos 1:1 do
 * protótipo (design_handoff → mnavStyle + markup mobile das ~linhas 204/1042).
 */

/** Item da bottom tab bar (coluna ícone+label, cor por estado ativo). */
export const tabItem = cva(
  "flex flex-col items-center gap-[3px] px-2 py-1 text-[10.5px] font-semibold transition-colors",
  {
    variants: {
      active: {
        true: "text-primary",
        false: "text-muted",
      },
    },
  },
);

/** Botão redondo da top bar (tema, sair, mês) — bg-card + borda. */
export const topBarButton = cva(
  "flex h-9 items-center justify-center rounded-pill border border-line bg-card text-fg2 transition-colors hover:text-fg",
  {
    variants: {
      shape: {
        icon: "w-9",
        pill: "gap-[6px] px-[13px] text-[13px] font-semibold text-fg",
      },
    },
    defaultVariants: { shape: "icon" },
  },
);
