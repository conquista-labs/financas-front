import { format, parse } from "date-fns";
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

  // Cada chip remove uma ou mais chaves (o range de cadastro zera as duas).
  const chips: { keys: (keyof TransactionFilters)[]; label: string }[] = [];

  const fmt = (iso: string) =>
    format(parse(iso, "yyyy-MM-dd", new Date()), "dd/MM/yyyy");

  if (filters.tipo)
    chips.push({
      keys: ["tipo"],
      label: filters.tipo === "receita" ? "Receitas" : "Despesas",
    });
  if (filters.categoriaId)
    chips.push({
      keys: ["categoriaId"],
      label: nameOf(categorias?.data?.rows, filters.categoriaId),
    });
  if (filters.pessoaId)
    chips.push({
      keys: ["pessoaId"],
      label: nameOf(pessoas?.data?.rows, filters.pessoaId),
    });
  if (filters.meioPagamentoId)
    chips.push({
      keys: ["meioPagamentoId"],
      label: nameOf(meios?.data?.rows, filters.meioPagamentoId),
    });
  if (filters.formaPagamento) {
    const forma = enums?.data?.formaPagamento?.find(
      (f) => f.value === filters.formaPagamento,
    );
    chips.push({
      keys: ["formaPagamento"],
      label: forma?.label ?? filters.formaPagamento,
    });
  }
  // A tag é filtrada por nome, então o próprio valor já é o rótulo (com #).
  if (filters.tag) chips.push({ keys: ["tag"], label: `#${filters.tag}` });

  // Range de data de cadastro (createdAt) — um único chip que zera os dois lados.
  if (filters.createdAtStart || filters.createdAtEnd) {
    const inicio = filters.createdAtStart ? fmt(filters.createdAtStart) : "…";
    const fim = filters.createdAtEnd ? fmt(filters.createdAtEnd) : "…";
    chips.push({
      keys: ["createdAtStart", "createdAtEnd"],
      label: `Cadastro: ${inicio} – ${fim}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.keys.join("-")}
          type="button"
          onClick={() => chip.keys.forEach((k) => onRemove(k))}
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
