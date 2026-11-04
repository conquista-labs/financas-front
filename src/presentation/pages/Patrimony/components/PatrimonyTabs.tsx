import { cn } from "@/lib/utils";

import { type Aba, GRUPO_LABEL, type ResumoGrupo } from "../patrimony.helpers";

interface PatrimonyTabsProps {
  aba: Aba;
  grupos: ResumoGrupo[];
  onChange: (aba: Aba) => void;
}

/**
 * Abas da página: Resumo (consolidado) e uma por grupo que tem itens, com a
 * contagem de linhas. Grupo sem itens não vira aba.
 */
export const PatrimonyTabs = ({
  aba,
  grupos,
  onChange,
}: PatrimonyTabsProps) => {
  const abas: Array<{ id: Aba; label: string; n?: number }> = [
    { id: "resumo", label: "Resumo" },
    ...grupos.map((g) => ({
      id: g.grupo,
      label: GRUPO_LABEL[g.grupo],
      n: g.linhas.length,
    })),
  ];
  return (
    <div
      role="tablist"
      aria-label="Grupos do patrimônio"
      className="nice-scroll mb-4 flex gap-1 overflow-x-auto border-b border-line"
    >
      {abas.map((a) => {
        const ativa = a.id === aba;
        return (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={ativa}
            onClick={() => onChange(a.id)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-[6px] border-b-2 px-[14px] py-[10px] text-[14px] font-semibold transition-colors",
              ativa
                ? "border-primary text-fg"
                : "border-transparent text-muted hover:text-fg2",
            )}
          >
            {a.label}
            {a.n !== undefined && (
              <span
                className={cn(
                  "rounded-full px-[7px] py-[1px] text-[11px] font-bold",
                  ativa ? "bg-primary/10 text-primary" : "bg-track text-muted",
                )}
              >
                {a.n}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
