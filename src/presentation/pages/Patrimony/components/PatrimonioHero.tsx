import type { ResumoPatrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";

import type { EvolucaoPoint } from "../patrimony.helpers";

interface PatrimonioHeroProps {
  resumo?: ResumoPatrimonio;
  pontos: EvolucaoPoint[];
  isLoading?: boolean;
}

const W = 440;
const H = 140;

const LINHAS: { chave: keyof Omit<EvolucaoPoint, "mes">; cor: string }[] = [
  { chave: "ativos", cor: "#6EE0A9" },
  { chave: "liquido", cor: "#9D91FF" },
  { chave: "passivos", cor: "#FF9A9E" },
];

/**
 * Topo de Patrimônio (padrão do Repaginado): card escuro com o líquido, quanto
 * mudou nos 12 meses, ativos/dívidas/caixa e as três linhas da evolução.
 */
export const PatrimonioHero = ({
  resumo,
  pontos,
  isLoading,
}: PatrimonioHeroProps) => {
  if (isLoading || !resumo)
    return <Skeleton className="h-[220px] rounded-[26px]" />;

  const variacao =
    pontos.length > 1
      ? pontos[pontos.length - 1].liquido - pontos[0].liquido
      : 0;

  // Mesma escala para as três linhas (dá para comparar ativos e dívidas).
  const valores = pontos.flatMap((p) => [p.ativos, p.liquido, p.passivos]);
  const max = Math.max(...valores, 1);
  const min = Math.min(...valores, 0);
  const linha = (chave: (typeof LINHAS)[number]["chave"]) =>
    pontos
      .map((p, i) => {
        const x = (i / (pontos.length - 1)) * W;
        const y = 8 + (1 - (p[chave] - min) / (max - min || 1)) * (H - 16);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <section className="flex flex-wrap items-end gap-6 rounded-[26px] bg-sidebar px-[26px] py-6 text-white dark:bg-[linear-gradient(160deg,#241E4A,#17152A)] dark:shadow-[inset_0_0_0_1px_#352E66]">
      <div className="min-w-0 flex-[1_1_280px]">
        <p className="text-sm text-[#B9B5C6]">Patrimônio líquido</p>
        <p className="mt-[6px] font-display text-[40px] font-bold leading-none -tracking-[0.04em] tabular-nums sm:text-[48px]">
          {formatCurrency(resumo.patrimonioLiquido)}
        </p>
        {variacao !== 0 && (
          <p
            className={
              variacao > 0
                ? "mt-[10px] text-[13.5px] font-semibold text-[#6EE0A9]"
                : "mt-[10px] text-[13.5px] font-semibold text-[#FF9A9E]"
            }
          >
            {variacao > 0 ? "+ " : "- "}
            {formatCurrency(Math.abs(variacao))} em 12 meses
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-x-[22px] gap-y-2 text-[13px]">
          <span>
            <span className="text-[#B9B5C6]">Ativos</span>
            <strong className="block font-display text-lg tabular-nums text-[#6EE0A9]">
              {formatCurrency(resumo.totalAtivos)}
            </strong>
          </span>
          <span>
            <span className="text-[#B9B5C6]">Dívidas</span>
            <strong className="block font-display text-lg tabular-nums text-[#FF9A9E]">
              {formatCurrency(resumo.totalPassivos)}
            </strong>
          </span>
          <span>
            <span className="text-[#B9B5C6]">Disponível em caixa</span>
            <strong className="block font-display text-lg tabular-nums">
              {formatCurrency(resumo.saldoDisponivel)}
            </strong>
          </span>
        </div>
      </div>

      {pontos.length > 1 && (
        <div className="min-w-0 flex-[1_1_320px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="none"
            role="img"
            aria-label="Últimos 12 meses: ativos, líquido e dívidas"
            className="overflow-visible"
          >
            {LINHAS.map((l) => (
              <polyline
                key={l.chave}
                fill="none"
                stroke={l.cor}
                strokeWidth={3}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                points={linha(l.chave)}
              />
            ))}
          </svg>
          <p className="mt-1 flex gap-3 text-[12px] text-[#B9B5C6]">
            {[
              ["Ativos", "#6EE0A9"],
              ["Líquido", "#9D91FF"],
              ["Dívidas", "#FF9A9E"],
            ].map(([t, c]) => (
              <span key={t} className="flex items-center gap-1">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: c }}
                />
                {t}
              </span>
            ))}
            <span className="ml-auto">
              {pontos[0].mes} – {pontos[pontos.length - 1].mes}
            </span>
          </p>
        </div>
      )}
    </section>
  );
};
