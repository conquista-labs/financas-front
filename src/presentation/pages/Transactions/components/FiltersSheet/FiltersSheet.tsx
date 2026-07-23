import { useEffect, useState } from "react";

import type { MeioPagamento } from "@/domain/models";
import { enhance } from "@/lib/color";
import { Combobox, DateField } from "@/presentation/components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/presentation/components/ui";
import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";

import { filterChip, filterLabel, filterPill } from "./filters.styles";

/** Filtros que o painel controla (subconjunto dos query params da tela). */
export interface TransactionFilters {
  tipo: string;
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  formaPagamento: string;
  startDate: string;
  endDate: string;
}

interface FiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
  onClear: () => void;
}

const OPT_LIMIT = { page: 1, limit: 100 };

/**
 * Painel de filtros (drawer lateral direito, fiel ao protótipo): Tipo,
 * Categoria, Pessoa, Meio, Forma e Período. Mantém um rascunho local e só
 * propaga no "Aplicar" (o "Limpar" zera). Opções vêm da API (enums/categorias/
 * pessoas/meios).
 */
export const FiltersSheet = ({
  open,
  onOpenChange,
  value,
  onApply,
  onClear,
}: FiltersSheetProps) => {
  const [draft, setDraft] = useState<TransactionFilters>(value);

  // Sincroniza o rascunho quando o painel abre (pega o estado atual da URL).
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const { data: enums } = useGetEnums();
  const { data: categorias } = useGetCategorias(OPT_LIMIT);
  const { data: pessoas } = useGetPessoas(OPT_LIMIT);
  const { data: meios } = useGetMeiosPagamento(OPT_LIMIT);

  const set = (patch: Partial<TransactionFilters>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const toggle = (key: keyof TransactionFilters, val: string) =>
    set({ [key]: draft[key] === val ? "" : val });

  const categoriaRows = categorias?.data?.rows ?? [];
  const pessoaRows = pessoas?.data?.rows ?? [];
  const meioRows = meios?.data?.rows ?? [];
  const formaOptions = enums?.data?.formaPagamento ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="nice-scroll flex w-[min(360px,90vw)] flex-col gap-[18px] overflow-y-auto border-line bg-card p-6"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-[19px] font-bold text-fg">
            Filtrar
          </SheetTitle>
        </SheetHeader>

        {/* Tipo */}
        <div>
          <span className={filterLabel()}>Tipo</span>
          <div className="flex gap-2">
            {["despesa", "receita"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => toggle("tipo", tipo)}
                className={filterPill({ active: draft.tipo === tipo })}
              >
                {tipo === "despesa" ? "Despesas" : "Receitas"}
              </button>
            ))}
          </div>
        </div>

        {/* Categoria */}
        <div>
          <span className={filterLabel()}>Categoria</span>
          <div className="nice-scroll -mr-2 flex max-h-[210px] flex-wrap gap-2 overflow-y-auto pr-2">
            {categoriaRows.map((cat) => {
              const active = draft.categoriaId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle("categoriaId", cat.id)}
                  className={filterChip({ active })}
                >
                  <span
                    className="size-[9px] rounded-full"
                    style={{ backgroundColor: enhance(cat.cor) }}
                  />
                  {cat.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pessoa */}
        <FilterSelect
          label="Pessoa"
          placeholder="Todas"
          value={draft.pessoaId}
          onValueChange={(v) => set({ pessoaId: v })}
          options={pessoaRows.map((p) => ({ value: p.id, label: p.nome }))}
        />

        {/* Meio de pagamento */}
        <FilterSelect
          label="Meio de pagamento"
          placeholder="Todos"
          value={draft.meioPagamentoId}
          onValueChange={(v) => set({ meioPagamentoId: v })}
          options={meioRows.map((m: MeioPagamento) => ({
            value: m.id,
            label: m.nome,
          }))}
        />

        {/* Forma de pagamento */}
        <FilterSelect
          label="Forma de pagamento"
          placeholder="Todas"
          value={draft.formaPagamento}
          onValueChange={(v) => set({ formaPagamento: v })}
          options={formaOptions.map((f) => ({
            value: f.value,
            label: f.label,
          }))}
        />

        {/* Período */}
        <div>
          <span className={filterLabel()}>Período</span>
          <div className="flex items-center gap-2">
            <DateField
              value={draft.startDate}
              onChange={(v) => set({ startDate: v })}
              placeholder="De"
            />
            <span className="text-muted">–</span>
            <DateField
              value={draft.endDate}
              onChange={(v) => set({ endDate: v })}
              placeholder="Até"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="mt-auto flex gap-[10px] pt-2">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 rounded-[13px] border border-line bg-card p-[13px] font-semibold text-fg transition-colors hover:border-primary"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="flex-1 rounded-[13px] bg-primary p-[13px] font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
          >
            Aplicar
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface FilterSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

/**
 * Select de filtro com busca e opção "todos" (o placeholder também é o rótulo
 * que zera o valor — ver `clearLabel` do Combobox).
 */
const FilterSelect = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
}: FilterSelectProps) => (
  <div>
    <span className={filterLabel()}>{label}</span>
    <Combobox
      inline
      options={options}
      value={value || undefined}
      onChange={onValueChange}
      placeholder={placeholder}
      clearLabel={placeholder}
      searchPlaceholder={`Buscar ${label.toLowerCase()}…`}
    />
  </div>
);
