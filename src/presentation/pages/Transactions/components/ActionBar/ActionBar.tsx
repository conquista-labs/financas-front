import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { actionButton } from "../../transactions.styles";

interface ActionBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onNew: () => void;
}

/**
 * Barra de ação da tela de Transações: busca (sempre visível), botão Filtros
 * com badge de contagem, e botão Nova (primário). Fiel ao protótipo.
 * (Importar entra na etapa de importação — omitido por ora.)
 */
export const ActionBar = ({
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  onNew,
}: ActionBarProps) => {
  return (
    <div className="mb-[14px] flex flex-wrap items-center gap-[10px]">
      {/* Busca */}
      <div className="flex h-12 min-w-[200px] flex-1 items-center gap-[10px] rounded-[13px] border border-line bg-card px-[14px]">
        <Search className="size-[18px] shrink-0 text-muted" strokeWidth={1.9} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por descrição ou categoria…"
          className="h-full w-full bg-transparent text-[14.5px] text-fg outline-none placeholder:text-muted"
        />
      </div>

      {/* Filtros */}
      <button type="button" onClick={onOpenFilters} className={actionButton()}>
        <SlidersHorizontal className="size-[17px]" strokeWidth={1.9} />
        Filtros
        {activeFilterCount > 0 && (
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-primary px-[5px] text-[11px] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Nova */}
      <button
        type="button"
        onClick={onNew}
        className="flex h-12 shrink-0 items-center gap-2 rounded-[13px] bg-primary px-[18px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
      >
        <Plus className="size-[17px]" strokeWidth={2.4} />
        Nova
      </button>
    </div>
  );
};
