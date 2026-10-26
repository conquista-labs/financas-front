import { Target, Trophy } from "lucide-react";

import type { MetasResumoResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

interface GoalsKpisProps {
  resumo?: MetasResumoResponse;
  isLoading?: boolean;
}

/**
 * Topo de Metas, simples: quantas metas em andamento e o total delas, e as
 * conquistas do ano. (O sistema não acompanha quanto já foi juntado.)
 */
export const GoalsKpis = ({ resumo, isLoading }: GoalsKpisProps) => {
  if (isLoading || !resumo)
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-[20px]" />
        ))}
      </div>
    );

  const conquistas = resumo.conquistas;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-4 rounded-[20px] border border-line bg-card px-[22px] py-5">
        <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
          <Target className="size-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-muted">
            {resumo.metasTotal} {resumo.metasTotal === 1 ? "meta" : "metas"} em
            andamento
          </p>
          <p className="font-display text-[22px] font-bold -tracking-[0.02em] text-fg">
            {formatCurrency(resumo.totalAlvo)}
            <span className="ml-1 font-sans text-[13px] font-medium text-muted">
              no total
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-[20px] border border-line bg-card px-[22px] py-5">
        <span className="grid size-11 place-items-center rounded-full bg-success/10 text-success">
          <Trophy className="size-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-muted">
            Conquistas em {conquistas?.ano ?? new Date().getFullYear()}
          </p>
          <p className="font-display text-[22px] font-bold -tracking-[0.02em] text-fg">
            {conquistas?.quantidade ?? 0}
            <span className="ml-1 font-sans text-[13px] font-medium text-muted">
              · {formatCurrency(conquistas?.valor ?? 0)} realizados
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
