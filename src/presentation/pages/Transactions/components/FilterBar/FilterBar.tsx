import { Search, SlidersHorizontal } from "lucide-react";

import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
  useGetTags,
} from "@/presentation/hooks/api";

import { FilterChip } from "./FilterChip";

const OPT = { page: 1, limit: 100 };

/** Os filtros da barra (valores da URL). */
export interface FiltrosBarra {
  tipo: string;
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  formaPagamento: string;
  tag: string;
  status: string;
}

interface FilterBarProps {
  busca: string;
  onBuscaChange: (v: string) => void;
  filtros: FiltrosBarra;
  onChange: (patch: Partial<FiltrosBarra>) => void;
  onLimpar: () => void;
  /** Filtros que ficam no painel (data de cadastro). */
  onMaisFiltros: () => void;
  maisFiltrosAtivos: number;
}

/**
 * Barra de filtros sempre à vista (protótipo v2): busca + um chip por filtro.
 * Data de cadastro continua no painel "Mais filtros".
 */
export const FilterBar = ({
  busca,
  onBuscaChange,
  filtros,
  onChange,
  onLimpar,
  onMaisFiltros,
  maisFiltrosAtivos,
}: FilterBarProps) => {
  const { data: categorias } = useGetCategorias(OPT);
  const { data: pessoas } = useGetPessoas(OPT);
  const { data: meios } = useGetMeiosPagamento(OPT);
  const { data: tags } = useGetTags();
  const { data: enums } = useGetEnums();

  const categoriasOpts = (categorias?.data?.rows ?? [])
    .filter((c) => !filtros.tipo || c.tipo === filtros.tipo)
    .map((c) => ({ value: c.id, label: c.nome }));
  const algumAtivo =
    !!busca || Object.values(filtros).some(Boolean) || maisFiltrosAtivos > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-line bg-card p-[10px]">
      <label className="flex h-[38px] w-full items-center sm:w-auto sm:min-w-[200px] sm:flex-[1_1_220px] gap-2 rounded-full bg-bg px-[14px] focus-within:ring-1 focus-within:ring-primary">
        <Search className="size-[15px] text-fg2" />
        <input
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por descrição, categoria ou valor"
          aria-label="Buscar"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>
      {/* No celular os filtros ficam numa linha só, com rolagem lateral. */}
      <div className="-mx-[10px] flex w-[calc(100%+20px)] gap-2 overflow-x-auto px-[10px] [scrollbar-width:none] sm:contents [&>*]:shrink-0">
        <FilterChip
          label="Tipo"
          value={filtros.tipo}
          options={[
            { value: "despesa", label: "Despesa" },
            { value: "receita", label: "Receita" },
          ]}
          onChange={(tipo) => onChange({ tipo, categoriaId: "" })}
        />
        <FilterChip
          busca
          label="Categoria"
          value={filtros.categoriaId}
          options={categoriasOpts}
          onChange={(categoriaId) => onChange({ categoriaId })}
        />
        <FilterChip
          busca
          label="Pessoa"
          value={filtros.pessoaId}
          options={(pessoas?.data?.rows ?? []).map((p) => ({
            value: p.id,
            label: p.nome,
          }))}
          onChange={(pessoaId) => onChange({ pessoaId })}
        />
        <FilterChip
          busca
          label="Meio"
          value={filtros.meioPagamentoId}
          options={(meios?.data?.rows ?? []).map((m) => ({
            value: m.id,
            label: m.nome,
          }))}
          onChange={(meioPagamentoId) => onChange({ meioPagamentoId })}
        />
        <FilterChip
          label="Forma"
          value={filtros.formaPagamento}
          options={(enums?.data?.formaPagamento ?? []).map((f) => ({
            value: f.value ?? "",
            label: f.label ?? "",
          }))}
          onChange={(formaPagamento) => onChange({ formaPagamento })}
        />
        <FilterChip
          busca
          label="Tag"
          value={filtros.tag}
          options={(tags?.data ?? []).map((t) => ({
            value: t.nome,
            label: `#${t.nome}`,
          }))}
          onChange={(tag) => onChange({ tag })}
        />
        <FilterChip
          label="Situação"
          value={filtros.status}
          options={[
            { value: "paga", label: "Paga" },
            { value: "pendente", label: "A pagar" },
            { value: "atrasada", label: "Atrasada" },
          ]}
          onChange={(status) => onChange({ status })}
        />
        <button
          type="button"
          onClick={onMaisFiltros}
          className="flex h-[34px] items-center gap-[6px] rounded-full border border-line bg-card px-3 text-[13px] font-semibold text-fg hover:border-primary/40"
        >
          <SlidersHorizontal className="size-[14px]" />
          Cadastro
          {maisFiltrosAtivos > 0 && (
            <span className="grid size-[18px] place-items-center rounded-full bg-primary text-[11px] text-white">
              {maisFiltrosAtivos}
            </span>
          )}
        </button>
        {algumAtivo && (
          <button
            type="button"
            onClick={onLimpar}
            className="h-[34px] px-2 text-[13px] font-semibold text-primary-strong hover:underline dark:text-[#B3A9FF]"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};
