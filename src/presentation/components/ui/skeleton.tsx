import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton primitivo (nova identidade "Nossa Grana").
 *
 * Diferente do padrão shadcn (que usa `animate-pulse`, um pisca-pisca de
 * opacidade no bloco inteiro), aqui o efeito é um SHIMMER que desliza sobre o
 * bloco. A opacidade do bloco não muda, então skeletons vizinhos não parecem
 * "crescer/encostar" quando ficam lado a lado num grid.
 *
 * O brilho é uma faixa larga (via ::before) que atravessa o bloco. As cores
 * têm contraste real com o `bg-track` em cada tema — no claro um brilho quase
 * branco, no escuro um brilho claro sobre o fundo escuro — pra ser claramente
 * perceptível, não um shimmer fantasma.
 */
export const Skeleton = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-track",
      // respeita quem prefere menos movimento
      "motion-reduce:before:hidden",
      // faixa de brilho que atravessa o bloco da esquerda p/ direita.
      // w-full + translateX de -100%→+100% (no keyframe) mantém a faixa
      // tocando a caixa durante quase todo o ciclo (visível, não "piscando").
      "before:absolute before:inset-y-0 before:left-0 before:w-full",
      "before:animate-om-shimmer before:bg-gradient-to-r",
      "before:from-transparent before:via-white/60 before:to-transparent",
      "dark:before:via-white/[0.08]",
      className,
    )}
    {...props}
  />
);
