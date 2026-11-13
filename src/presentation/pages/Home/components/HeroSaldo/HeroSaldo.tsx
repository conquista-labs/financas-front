import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import type { PontoSaldo } from "../../inicio.helpers";
import { percentualGuardado } from "../../inicio.helpers";

interface HeroSaldoProps {
  /** "novembro" */
  mesNome: string;
  saldo?: number;
  receitas?: number;
  despesas?: number;
  pontos: PontoSaldo[];
  /** Último dia real (o resto é previsão, tracejado). */
  corte: number;
  diasNoMes: number;
  isLoading?: boolean;
}

const W = 600;
const H = 90;
const PAD = 8;

/** Coordenadas SVG da série (y invertido, com folga em cima e embaixo). */
const coords = (pontos: PontoSaldo[], diasNoMes: number) => {
  const valores = pontos.map((p) => p.saldo);
  const min = Math.min(0, ...valores);
  const max = Math.max(0, ...valores);
  const faixa = max - min || 1;
  const x = (dia: number) => ((dia - 1) / Math.max(1, diasNoMes - 1)) * W;
  const y = (v: number) => PAD + (1 - (v - min) / faixa) * (H - PAD * 2);
  return pontos.map((p) => ({ dia: p.dia, x: x(p.dia), y: y(p.saldo) }));
};

const linha = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/**
 * Saldo do mês em destaque (cartão escuro do "Repaginado"): quanto sobrou,
 * quanto entrou e saiu, e a linha do saldo acumulado — cheia até hoje,
 * tracejada depois (só contas já agendadas, ou seja, a previsão).
 */
export const HeroSaldo = ({
  mesNome,
  saldo,
  receitas,
  despesas,
  pontos,
  corte,
  diasNoMes,
  isLoading,
}: HeroSaldoProps) => {
  if (isLoading) return <Skeleton className="h-[280px] rounded-[26px]" />;

  const pct = percentualGuardado(saldo, receitas);
  const azul = (saldo ?? 0) >= 0;
  const pts = coords(pontos, diasNoMes);
  const reais = pts.filter((p) => p.dia <= corte);
  const futuros = pts.filter((p) => p.dia >= corte);
  // A previsão parte do último ponto real (ou do primeiro, se tudo é futuro).
  const previsao = reais.length
    ? [reais.at(-1)!, ...futuros.filter((p) => p.dia > corte)]
    : futuros;
  const marco = reais.at(-1);

  return (
    <section className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-[26px] bg-sidebar p-5 text-white sm:p-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-[#B9B5C6]">Saldo de {mesNome}</p>
          <p className="mt-[6px] font-display text-[40px] font-bold leading-none -tracking-[0.03em] tabular-nums sm:text-[52px]">
            {formatCurrency(saldo ?? 0)}
          </p>
          <span
            className={cn(
              "mt-3 inline-block rounded-full px-[10px] py-1 text-[12.5px] font-bold",
              azul
                ? "bg-success/20 text-[#7FE0B0]"
                : "bg-danger/20 text-[#FF9EA2]",
            )}
          >
            {azul ? "no azul" : "no vermelho"}
            {pct !== null && pct > 0 && ` · ${pct}% da renda guardada`}
          </span>
        </div>
        <div className="flex gap-[22px]">
          <div>
            <p className="text-[12.5px] text-[#B9B5C6]">Entrou</p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums text-[#7FE0B0] sm:text-[22px]">
              {formatCurrency(receitas ?? 0)}
            </p>
          </div>
          <div>
            <p className="text-[12.5px] text-[#B9B5C6]">Saiu</p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums text-[#FF9EA2] sm:text-[22px]">
              {formatCurrency(despesas ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {pts.length > 1 && (
        // No celular fica só o número (como no protótipo mobile).
        <div className="hidden sm:contents">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Saldo acumulado ao longo de ${mesNome}`}
            className="mt-auto overflow-visible"
          >
            {reais.length > 1 && (
              <polyline
                fill="none"
                stroke="#7B6CF0"
                strokeWidth={3}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                points={linha(reais)}
              />
            )}
            {previsao.length > 1 && (
              <polyline
                fill="none"
                stroke="#7B6CF0"
                strokeWidth={3}
                strokeDasharray="6 6"
                opacity={0.55}
                vectorEffect="non-scaling-stroke"
                points={linha(previsao)}
              />
            )}
            {marco && corte < diasNoMes && (
              <circle cx={marco.x} cy={marco.y} r={5} fill="#FFFFFF" />
            )}
          </svg>
          <p className="-mt-2 text-[12.5px] text-[#B9B5C6]">
            {corte >= diasNoMes
              ? "Saldo acumulado dia a dia no mês."
              : "Linha tracejada: previsão até o fim do mês com as contas a pagar."}
          </p>
        </div>
      )}
    </section>
  );
};
