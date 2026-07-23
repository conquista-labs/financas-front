import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import type { TransacaoResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ScrollListCard } from "@/presentation/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/presentation/components/ui";

import { TransactionRow } from "../TransactionRow";

interface TransactionsListProps {
  rows: TransacaoResponse[];
  /** Total do período. A API entrega já formatado (string "R$ …"); aceita number por segurança. */
  total: number | string;
  totalItems: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isExporting?: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (transacao: TransacaoResponse) => void;
  onDelete: (transacao: TransacaoResponse) => void;
  onChangePage: (page: number) => void;
  onChangePageSize: (size: number) => void;
  onExport: () => void;
}

// inclui 25 (default do usePagination) para o Select nunca ficar sem match
const PAGE_SIZES = [20, 25, 50, 100];

/**
 * Lista de transações — usa o ScrollListCard genérico (card + scroll fixo +
 * estados) e passa suas próprias linhas, skeleton e rodapé (paginação por
 * página 20/50/100 + navegação, Exportar CSV + Total do período).
 */
export const TransactionsList = ({
  rows,
  total,
  totalItems,
  page,
  pageSize,
  isLoading,
  isExporting,
  onEdit,
  onDuplicate,
  onDelete,
  onChangePage,
  onChangePageSize,
  onExport,
}: TransactionsListProps) => {
  const lastPage = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const hasPages = totalItems > pageSize;

  const footer = (
    <>
      {/* Paginação */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-line2 pb-1 pt-[14px]">
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] font-medium text-muted">
            {hasPages
              ? `Mostrando ${from}–${to} de ${totalItems}`
              : `${totalItems} lançamento(s)`}
          </span>
          <div className="flex items-center gap-2 text-[12.5px] text-muted">
            <Select
              value={String(pageSize)}
              onValueChange={(v) => onChangePageSize(Number(v))}
            >
              <SelectTrigger
                aria-label="Itens por página"
                className="h-8 w-[68px] rounded-[9px] border-line bg-card text-[12.5px] font-semibold text-fg"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            por página
          </div>
        </div>

        {hasPages && (
          <div className="flex gap-[5px]">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => onChangePage(page - 1)}
              className={navButton}
            >
              <ChevronLeft className="size-4" strokeWidth={1.9} />
            </button>
            <button
              type="button"
              aria-label="Próxima página"
              disabled={page >= lastPage}
              onClick={() => onChangePage(page + 1)}
              className={navButton}
            >
              <ChevronRight className="size-4" strokeWidth={1.9} />
            </button>
          </div>
        )}
      </div>

      {/* Export + total do período */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line2 pb-2 pt-[14px]">
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-[11px] border border-line bg-card px-[15px] py-[10px] text-[13.5px] font-semibold text-fg transition-colors hover:border-primary disabled:opacity-60"
        >
          <Download className="size-4" strokeWidth={1.9} />
          {isExporting ? "Exportando…" : "Exportar CSV"}
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-fg2">
            Total do período
          </span>
          <span className="font-display text-[20px] font-bold -tracking-[0.02em] text-fg">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <ScrollListCard
      isLoading={isLoading}
      isEmpty={rows.length === 0}
      skeleton={<ListSkeleton />}
      emptyState={<EmptyState />}
      footer={footer}
    >
      {rows.map((transacao) => (
        <TransactionRow
          key={transacao.id}
          transacao={transacao}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </ScrollListCard>
  );
};

const navButton = cn(
  "grid size-[34px] place-items-center rounded-[10px] border border-line bg-bg text-fg2",
  "transition-colors hover:bg-line2 disabled:opacity-40 disabled:hover:bg-bg",
);

const EmptyState = () => (
  <div className="px-5 py-[54px] text-center text-muted">
    <p className="text-[15px] font-semibold text-fg2">Nada por aqui</p>
    <p className="mt-1 text-[13.5px]">
      Nenhuma transação encontrada para os filtros deste período.
    </p>
  </div>
);

const ListSkeleton = () => (
  <div>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-[14px] border-b border-line2 py-[15px] last:border-b-0"
      >
        <Skeleton className="size-[42px] shrink-0 rounded-[12px]" />
        <div className="flex-1 space-y-[6px]">
          <Skeleton className="h-[13px] w-1/3 rounded-full" />
          <Skeleton className="h-[11px] w-1/2 rounded-full" />
        </div>
        <div className="space-y-[6px] text-right">
          <Skeleton className="ml-auto h-[13px] w-20 rounded-full" />
          <Skeleton className="ml-auto h-[11px] w-10 rounded-full" />
        </div>
        <div className="flex shrink-0 gap-[5px]">
          <Skeleton className="size-[34px] rounded-[10px]" />
          <Skeleton className="size-[34px] rounded-[10px]" />
          <Skeleton className="size-[34px] rounded-[10px]" />
        </div>
      </div>
    ))}
  </div>
);
