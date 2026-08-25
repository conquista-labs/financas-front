import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";

import type { ReviewCounts, ReviewFilter, ReviewLine } from "../import.helpers";

interface ReviewToolbarProps {
  filter: ReviewFilter;
  onFilterChange: (f: ReviewFilter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  counts: ReviewCounts;
  /** Linhas atualmente exibidas (após aba + busca) — alvo das ações em massa. */
  visible: ReviewLine[];
  categorias: ComboboxOption[];
  pessoas: ComboboxOption[];
  formas: ComboboxOption[];
  /** Marca/desmarca todas as exibidas. */
  onToggleAll: (incluir: boolean) => void;
  /** Aplica um patch (categoria/pessoa/forma) a todas as exibidas. */
  onApplyToVisible: (patch: Partial<ReviewLine>) => void;
  /** Liga a propagação de parcelas em todas as exibidas que forem parceladas. */
  onCreateFutures: () => void;
}

const TABS: {
  v: ReviewFilter;
  label: string;
  count: (c: ReviewCounts) => number;
}[] = [
  { v: "todas", label: "Todas", count: (c) => c.lidas },
  { v: "revisar", label: "Revisar", count: (c) => c.atencao },
  { v: "duplicadas", label: "Duplicadas", count: (c) => c.duplicadas },
  { v: "parceladas", label: "Parceladas", count: (c) => c.parceladas },
];

const actionSelectCls =
  "!rounded-[10px] !border-line !px-[11px] !py-[8px] !text-[12.5px]";

/**
 * Barra de controle da revisão (fiel ao protótipo): abas com contadores +
 * busca na primeira linha; ações em massa (marcar exibidos, aplicar
 * categoria/quem/pagamento aos exibidos, criar futuras das parceladas) na
 * segunda. Todas as ações operam sobre as linhas **exibidas** (após filtro).
 */
export const ReviewToolbar = ({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  counts,
  visible,
  categorias,
  pessoas,
  formas,
  onToggleAll,
  onApplyToVisible,
  onCreateFutures,
}: ReviewToolbarProps) => {
  const visN = visible.length;
  const allChecked = visN > 0 && visible.every((l) => l.incluir);
  const parceladasVisiveis = visible.filter((l) =>
    /^parcela(\d+)x$/.test(l.formaPagamento),
  ).length;

  return (
    <div className="border-b border-line2 pb-[14px] pt-1">
      {/* Linha 1: abas + busca */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-[5px] rounded-[12px] bg-track p-1">
          {TABS.map((t) => {
            const active = filter === t.v;
            const n = t.count(counts);
            return (
              <button
                key={t.v}
                type="button"
                onClick={() => onFilterChange(t.v)}
                className={cn(
                  "rounded-[9px] px-[13px] py-[7px] text-[12.5px] font-semibold transition-colors",
                  active
                    ? "bg-card text-primary-strong shadow-[0_2px_6px_rgba(0,0,0,.08)]"
                    : "text-muted hover:text-fg",
                )}
              >
                {t.label} ({n})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px] flex-1 sm:max-w-[280px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-muted"
            strokeWidth={2}
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar no extrato"
            aria-label="Buscar no extrato"
            className="w-full rounded-[10px] border border-line bg-card py-[8px] pl-9 pr-3 text-[13px] outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Linha 2: ações em massa */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[12px] bg-bg px-3 py-[10px]">
        <label className="flex items-center gap-2 text-[12.5px] font-semibold text-fg2">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => onToggleAll(e.target.checked)}
            className="size-[15px] accent-[var(--primary)]"
          />
          Marcar exibidos
        </label>

        <span className="text-[12.5px] font-semibold text-primary-strong">
          Aplicar aos {visN} exibidos:
        </span>

        <Combobox
          options={categorias}
          value=""
          onChange={(v) => v && onApplyToVisible({ categoriaId: v })}
          placeholder="Categoria…"
          searchPlaceholder="Buscar categoria…"
          className={cn(actionSelectCls, "w-[150px]")}
          contentClassName="min-w-[210px]"
        />
        <Combobox
          options={pessoas}
          value=""
          onChange={(v) => v && onApplyToVisible({ pessoaId: v })}
          placeholder="Quem…"
          searchPlaceholder="Buscar pessoa…"
          className={cn(actionSelectCls, "w-[130px]")}
          contentClassName="min-w-[210px]"
        />
        <Combobox
          options={formas}
          value=""
          onChange={(v) => v && onApplyToVisible({ formaPagamento: v })}
          placeholder="Pagamento…"
          searchPlaceholder="Buscar forma…"
          className={cn(actionSelectCls, "w-[150px]")}
          contentClassName="min-w-[210px]"
        />

        {parceladasVisiveis > 0 && (
          <button
            type="button"
            onClick={onCreateFutures}
            className="rounded-[10px] border border-line bg-card px-[13px] py-[8px] text-[12.5px] font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
          >
            Criar futuras das parceladas
          </button>
        )}
      </div>
    </div>
  );
};
