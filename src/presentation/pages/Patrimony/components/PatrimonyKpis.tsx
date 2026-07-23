import type { ResumoPatrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

interface PatrimonyKpisProps {
  resumo?: ResumoPatrimonio;
  isLoading?: boolean;
}

/**
 * Três KPIs do topo: Patrimônio líquido (card em destaque com gradiente verde),
 * Ativos (verde) e Passivos (vermelho). Grid 1.4fr / 1fr / 1fr no desktop.
 */
export const PatrimonyKpis = ({ resumo, isLoading }: PatrimonyKpisProps) => {
  if (isLoading || !resumo)
    return (
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-[20px]" />
        ))}
      </div>
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
      {/* Patrimônio líquido — destaque */}
      <div
        className="rounded-[20px] px-6 py-[22px] text-white shadow-[0_18px_36px_-22px_rgba(18,166,106,.7)]"
        style={{ background: "linear-gradient(150deg,#0f3d2e,#12A66A 150%)" }}
      >
        <p className="text-[13px] opacity-85">Patrimônio líquido</p>
        <p className="mt-[6px] font-display text-[32px] font-bold -tracking-[0.03em]">
          {formatCurrency(resumo.patrimonioLiquido)}
        </p>
        <p className="mt-1 text-[12.5px] opacity-80">
          Disponível em caixa: {formatCurrency(resumo.saldoDisponivel)}
        </p>
      </div>

      {/* Ativos */}
      <div className="rounded-[20px] border border-line bg-card px-6 py-[22px]">
        <p className="text-[13px] text-muted">Ativos</p>
        <p className="mt-[6px] font-display text-[26px] font-bold -tracking-[0.02em] text-success">
          {formatCurrency(resumo.totalAtivos)}
        </p>
      </div>

      {/* Passivos */}
      <div className="rounded-[20px] border border-line bg-card px-6 py-[22px]">
        <p className="text-[13px] text-muted">Passivos</p>
        <p className="mt-[6px] font-display text-[26px] font-bold -tracking-[0.02em] text-danger">
          {formatCurrency(resumo.totalPassivos)}
        </p>
      </div>
    </div>
  );
};
