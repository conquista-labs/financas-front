import { cva } from "class-variance-authority";

/**
 * Variantes de estilo da Sidebar (cva). Extrai os grupos de classe recorrentes
 * do JSX, mantendo o Tailwind embaixo mas com nomes e type-safety. Padrão do
 * rebrand: componentes com muitas classes ganham um `.styles.ts` colocalizado.
 * Valores reproduzidos do protótipo (design_handoff → navStyle/lancarStyle/etc.).
 */

export const aside = cva(
  "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-card transition-[width] duration-200 ease-out lg:flex py-[22px]",
  {
    variants: {
      collapsed: {
        true: "w-[76px] px-3",
        false: "w-[252px] px-4",
      },
    },
  },
);

export const navItem = cva(
  "flex w-full items-center rounded-[12px] text-[14.5px] font-semibold transition-all",
  {
    variants: {
      collapsed: {
        true: "justify-center gap-0 p-3",
        false: "justify-start gap-3 px-[14px] py-[11px]",
      },
      active: {
        true: "bg-primary-soft text-primary",
        false: "text-fg2 hover:bg-line2",
      },
    },
  },
);

export const launchButton = cva(
  "mt-5 flex items-center justify-center bg-primary text-white shadow-[0_10px_22px_-10px_rgba(91,75,224,0.8)]",
  {
    variants: {
      collapsed: {
        true: "rounded-[14px] py-[14px]",
        false: "gap-[9px] rounded-[13px] p-[13px] text-[14.5px] font-semibold",
      },
    },
  },
);

export const themePill = cva(
  "mt-auto flex items-center justify-center rounded-[12px] bg-track text-fg2",
  {
    variants: {
      collapsed: {
        true: "py-3",
        false: "gap-[9px] p-[11px] text-[13.5px] font-semibold",
      },
    },
  },
);

/** Botão-ícone quadrado com fundo track (logo recolher, sair). */
export const iconTile = cva(
  "grid shrink-0 place-items-center transition-colors disabled:opacity-50",
  {
    variants: {
      tone: {
        brand:
          "bg-primary text-white shadow-[0_6px_16px_-6px_rgba(91,75,224,0.7)] hover:scale-105",
        track: "bg-track text-fg2 hover:text-danger",
      },
      size: {
        sm: "size-8 rounded-[9px]",
        md: "size-[38px] rounded-[11px]",
      },
    },
    defaultVariants: { tone: "track", size: "md" },
  },
);
