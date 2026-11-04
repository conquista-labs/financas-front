import {
  Car,
  ChevronRight,
  Home,
  type LucideIcon,
  PiggyBank,
  Receipt,
} from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import {
  type Grupo,
  GRUPO_LABEL,
  type ResumoGrupo,
} from "../patrimony.helpers";

const VISUAL: Record<Grupo, { icon: LucideIcon; cor: string }> = {
  imoveis: { icon: Home, cor: "#6C5CE7" },
  veiculos: { icon: Car, cor: "#2D9CDB" },
  reservas: { icon: PiggyBank, cor: "#12A66A" },
  dividas: { icon: Receipt, cor: "#E5484D" },
};

interface ResumoGruposProps {
  grupos: ResumoGrupo[];
  isLoading?: boolean;
  onAbrir: (grupo: Grupo) => void;
}

/** "3 itens · 2 financiados" — o que tem dentro do grupo. */
const detalhe = (g: ResumoGrupo) => {
  const n = g.linhas.length;
  const partes = [`${n} ${n === 1 ? "item" : "itens"}`];
  const financiados = g.linhas.filter((r) => r.financiamento).length;
  if (financiados)
    partes.push(
      `${financiados} ${financiados === 1 ? "financiado" : "financiados"}`,
    );
  return partes.join(" · ");
};

/**
 * Consolidado por grupo (aba Resumo): quanto de cada grupo é de vocês, a fatia
 * no patrimônio e o que tem dentro. Clicar abre a aba do grupo.
 */
export const ResumoGrupos = ({
  grupos,
  isLoading,
  onAbrir,
}: ResumoGruposProps) => {
  // Fatia de cada grupo no que vocês têm (sem as dívidas soltas).
  const totalLiquido = grupos
    .filter((g) => g.liquido > 0)
    .reduce((s, g) => s + g.liquido, 0);
  return (
    <div className="rounded-[20px] border border-line bg-card p-5">
      <h3 className="font-display text-[17px] font-semibold text-fg">
        Por grupo
      </h3>
      {isLoading ? (
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : grupos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">
          Nenhum item cadastrado.
        </p>
      ) : (
        <div className="mt-2 flex flex-col">
          {grupos.map((g) => {
            const { icon: Icon, cor } = VISUAL[g.grupo];
            const pct =
              totalLiquido > 0 && g.liquido > 0
                ? (g.liquido / totalLiquido) * 100
                : 0;
            return (
              <button
                key={g.grupo}
                type="button"
                onClick={() => onAbrir(g.grupo)}
                className="-mx-2 flex items-center gap-3 rounded-[12px] px-2 py-[11px] text-left transition-colors hover:bg-bg"
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                  style={{ backgroundColor: `${cor}1A`, color: cor }}
                >
                  <Icon className="size-[18px]" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[14px] font-semibold text-fg">
                      {GRUPO_LABEL[g.grupo]}
                    </span>
                    <span
                      className={
                        g.liquido < 0
                          ? "shrink-0 font-display text-[14px] font-semibold text-danger"
                          : "shrink-0 font-display text-[14px] font-semibold text-fg"
                      }
                    >
                      {g.liquido < 0 && "- "}
                      {formatCurrency(Math.abs(g.liquido))}
                    </span>
                  </span>
                  <span className="mt-[2px] flex items-center justify-between gap-2 text-[12px] text-muted">
                    <span className="truncate">{detalhe(g)}</span>
                    {g.divida > 0 && g.valor > 0 && (
                      <span className="shrink-0">
                        vale {formatCurrency(g.valor)}
                      </span>
                    )}
                  </span>
                  {pct > 0 && (
                    <span className="mt-[6px] block h-[5px] w-full overflow-hidden rounded-full bg-track">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: cor }}
                      />
                    </span>
                  )}
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted"
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
