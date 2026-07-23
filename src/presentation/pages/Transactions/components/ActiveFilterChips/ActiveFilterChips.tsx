import { X } from "lucide-react";

import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";

import type { TransactionFilters } from "../FiltersSheet";

interface ActiveFilterChipsProps {
  filters: TransactionFilters;
  /** Remove um filtro específico (zera aquela chave). */
  onRemove: (key: keyof TransactionFilters) => void;
  onClearAll: () => void;
}

const OPT_LIMIT = { page: 1, limit: 100 };

/**
 * Chips dos filtros ativos (removíveis) + "Limpar tudo", exibidos acima da
 * lista. Resolve os IDs em rótulos legíveis (nome da categoria/pessoa/meio).
 * Não mostra o período (fica no seletor de mês do header).
 */
export const ActiveFilterChips = ({
  filters,
  onRemove,
  onClearAll,
}: ActiveFilterChipsProps) => {
  const { data: enums } = useGetEnums();
  const { data: categorias } = useGetCategorias(OPT_LIMIT);
  const { data: pessoas } = useGetPessoas(OPT_LIMIT);
  const { data: meios } = useGetMeiosPagamento(OPT_LIMIT);

  const nameOf = (
    rows: { id: string; nome: string }[] | undefined,
    id: string,
  ) => rows?.find((r) => r.id === id)?.nome ?? id;

  const chips: { key: keyof TransactionFilters; label: string }[] = [];

  if (filters.tipo)
    chips.push({
      key: "tipo",
      label: filters.tipo === "receita" ? "Receitas" : "Despesas",
    });
  if (filters.categoriaId)
    chips.push({
      key: "categoriaId",
      label: nameOf(categorias?.data?.rows, filters.categoriaId),
    });
  if (filters.pessoaId)
    chips.push({
      key: "pessoaId",
      label: nameOf(pessoas?.data?.rows, filters.pessoaId),
    });
  if (filters.meioPagamentoId)
    chips.push({
      key: "meioPagamentoId",
      label: nameOf(meios?.data?.rows, filters.meioPagamentoId),
    });
  if (filters.formaPagamento) {
    const forma = enums?.data?.formaPagamento?.find(
      (f) => f.value === filters.formaPagamento,
    );
    chips.push({
      key: "formaPagamento",
      label: forma?.label ?? filters.formaPagamento,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="flex items-center gap-[7px] rounded-pill bg-primary-soft py-[7px] pl-[13px] pr-2 text-[13px] font-semibold text-primary-strong"
        >
          {chip.label}
          <span className="grid size-[17px] place-items-center rounded-full bg-primary/20">
            <X className="size-[10px]" strokeWidth={2.6} />
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="p-[7px] text-[13px] font-semibold text-muted transition-colors hover:text-fg"
      >
        Limpar tudo
      </button>
    </div>
  );
};
