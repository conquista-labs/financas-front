import type { MetasResumoResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

interface GoalsKpisProps {
  resumo?: MetasResumoResponse;
  isLoading?: boolean;
}

/**
 * KPIs do topo de Metas (fiel ao protótipo): grid 1.25fr / 1fr com dois cards —
 * o herói roxo (total guardado + barra de progresso) e um card branco que
 * combina "aportado no mês vs planejado" e "metas no ritmo".
 */
export const GoalsKpis = ({ resumo, isLoading }: GoalsKpisProps) => {
  if (isLoading || !resumo)
    return (
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-[150px] rounded-[20px]" />
        ))}
      </div>
    );

  const pct = Math.max(0, Math.min(100, resumo.percentual));
  const atrasadas = resumo.metasTotal - resumo.metasNoRitmo;
  const atrasadasLabel =
    atrasadas <= 0
      ? "tudo em dia"
      : `${atrasadas} ${atrasadas === 1 ? "precisa" : "precisam"} de atenção`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      {/* Herói — guardado para os sonhos */}
      <div
        className="rounded-[20px] px-6 py-[22px] text-white shadow-[0_20px_40px_-22px_rgba(43,35,80,.7)]"
        style={{
          background: "linear-gradient(150deg,#2b2350 0%,#5B4BE0 130%)",
        }}
      >
        <p className="text-[13px] opacity-85">Guardado para nossos sonhos</p>
        <p className="mt-[6px] font-display text-[34px] font-bold -tracking-[0.03em]">
          {formatCurrency(resumo.totalGuardado)}
        </p>
        <p className="mt-[2px] text-[12.5px] opacity-80">
          de {formatCurrency(resumo.totalAlvo)} · {pct}% do caminho
        </p>
        <div className="mt-[14px] h-2 overflow-hidden rounded-full bg-white/[.22]">
          <div
            className="h-full rounded-full bg-white transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Card branco combinado */}
      <div className="flex flex-col justify-center gap-4 rounded-[20px] border border-line bg-card px-6 py-[22px]">
        <div>
          <p className="text-[13px] text-muted">Aportado no mês</p>
          <p className="mt-1 font-display text-[26px] font-bold text-success">
            {formatCurrency(resumo.aportadoNoMes)}
            <span className="ml-1 font-sans text-[13px] font-medium text-muted">
              de {formatCurrency(resumo.aportePlanejado)} planejado
            </span>
          </p>
        </div>
        <p className="border-t border-line2 pt-[14px] text-[13px] text-fg2">
          <strong className="font-semibold">
            {resumo.metasNoRitmo} de {resumo.metasTotal}
          </strong>{" "}
          metas no ritmo · {atrasadasLabel}
        </p>
      </div>
    </div>
  );
};
