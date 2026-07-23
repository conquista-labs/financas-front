import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ScrollListCardProps {
  /** Linhas da lista (já renderizadas pela tela que usa). */
  children: ReactNode;
  /** Rodapé fixo (paginação, export, total...). Opcional. */
  footer?: ReactNode;
  isLoading?: boolean;
  /** Considera vazio quando não há linhas. */
  isEmpty?: boolean;
  /** Conteúdo do estado vazio. */
  emptyState?: ReactNode;
  /** Skeleton exibido enquanto isLoading. */
  skeleton?: ReactNode;
  /** Altura máxima da área de scroll (px). Padrão 560 (Transações). */
  maxHeight?: number;
  className?: string;
}

/**
 * Card de lista com scroll interno de altura fixa e rodapé fixo — o padrão
 * "card-lista" da nova identidade "Nossa Grana", reutilizado em Transações,
 * Cadastros (Categorias/Pessoas/Meios) e Importar.
 *
 * Não sabe NADA sobre o conteúdo das linhas: cada tela passa suas próprias
 * linhas via children, seu skeleton, seu empty state e seu footer. O que este
 * componente encapsula é só o contêiner que se repete (card + área de scroll
 * com o truque de margem negativa para os divisores irem de borda a borda).
 */
export const ScrollListCard = ({
  children,
  footer,
  isLoading,
  isEmpty,
  emptyState,
  skeleton,
  maxHeight = 560,
  className,
}: ScrollListCardProps) => {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-card px-[22px] pb-2 pt-[6px]",
        className,
      )}
    >
      <div
        className="nice-scroll -mx-[22px] min-h-[200px] overflow-y-auto px-[22px]"
        style={{ maxHeight }}
      >
        {isLoading ? skeleton : isEmpty ? emptyState : children}
      </div>
      {footer}
    </div>
  );
};
