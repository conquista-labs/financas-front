import { useState } from "react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import type { PontoSaldo } from "../../inicio.helpers";
import { escalaDoSaldo, percentualGuardado } from "../../inicio.helpers";

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

interface HeroSaldoProps {
  /** "novembro" */
  mesNome: string;
  saldo?: number;
  receitas?: number;
  despesas?: number;
  ano: number;
  /** Mês escolhido (1–12), marcado na linha. */
  mes: number;
  onSelectMonth?: (mes: number) => void;
  /** Saldo no fim de cada mês do ano. */
  pontos: PontoSaldo[];
  /** Último mês real (o resto é previsão, tracejado). */
  corte: number;
  isLoading?: boolean;
}

const W = 600;
const H = 90;
const PAD = 8;

/**
 * Coordenadas SVG da série (y invertido, com folga em cima e embaixo). A
 * escala é comprimida (ver `escalaDoSaldo`) para um mês alto não achatar o resto.
 */
const coords = (pontos: PontoSaldo[]) => {
  const valores = pontos.map((p) => p.saldo);
  const min = Math.min(...valores);
  const escala = escalaDoSaldo(valores);
  const x = (mes: number) => ((mes - 1) / 11) * W;
  const y = (v: number) => PAD + (1 - escala(v)) * (H - PAD * 2);
  return {
    pts: pontos.map((p) => ({ ...p, x: x(p.mes), y: y(p.saldo) })),
    // Linha do zero só quando a série fica negativa em algum mês.
    zero: min < 0 ? y(0) : null,
  };
};

const linha = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const pct = (x: number) => `${(x / W) * 100}%`;

/**
 * Saldo do mês em destaque (cartão escuro do "Repaginado"): o saldo acumulado
 * no fim do mês escolhido, quanto entrou e saiu, e a evolução do saldo mês a
 * mês no ano — cheia até o mês atual, tracejada depois (só o que já está
 * lançado, ou seja, a previsão). Clicar num mês troca o período da página.
 */
export const HeroSaldo = ({
  mesNome,
  saldo,
  receitas,
  despesas,
  ano,
  mes,
  onSelectMonth,
  pontos,
  corte,
  isLoading,
}: HeroSaldoProps) => {
  const [foco, setFoco] = useState<number | null>(null);

  if (isLoading) return <Skeleton className="h-[280px] rounded-[26px]" />;

  // "% da renda guardada" é sobre o que sobrou no mês, não o acumulado.
  const guardado = percentualGuardado(
    (receitas ?? 0) - (despesas ?? 0),
    receitas,
  );
  const azul = (saldo ?? 0) >= 0;
  const { pts, zero } = coords(pontos);
  const reais = pts.filter((p) => p.mes <= corte);
  const futuros = pts.filter((p) => p.mes >= corte);
  // A previsão parte do último ponto real (ou do primeiro, se tudo é futuro).
  const previsao = reais.length
    ? [reais.at(-1)!, ...futuros.filter((p) => p.mes > corte)]
    : futuros;
  const escolhido = pts.find((p) => p.mes === mes);
  const focado = foco !== null ? pts[foco] : undefined;

  // Mês mais próximo do mouse (pelo eixo x).
  const maisProximo = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const alvo = ((e.clientX - r.left) / r.width) * W;
    let melhor = 0;
    pts.forEach((p, i) => {
      if (Math.abs(p.x - alvo) < Math.abs(pts[melhor].x - alvo)) melhor = i;
    });
    return melhor;
  };

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
            {guardado !== null &&
              guardado > 0 &&
              ` · ${guardado}% da renda guardada`}
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
          <div
            className={cn(
              "relative mt-auto pb-5",
              onSelectMonth && "cursor-pointer",
            )}
            onPointerMove={(e) => setFoco(maisProximo(e))}
            onPointerLeave={() => setFoco(null)}
            onClick={(e) => {
              const i = maisProximo(e);
              setFoco(i);
              onSelectMonth?.(pts[i].mes);
            }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              height={H}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Saldo no fim de cada mês de ${ano}`}
              className="block overflow-visible"
            >
              {zero !== null && (
                <line
                  x1={0}
                  x2={W}
                  y1={zero}
                  y2={zero}
                  stroke="#FF9EA2"
                  strokeOpacity={0.35}
                  strokeDasharray="2 4"
                  vectorEffect="non-scaling-stroke"
                />
              )}
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
              {focado && (
                <line
                  x1={focado.x}
                  x2={focado.x}
                  y1={0}
                  y2={H}
                  stroke="#B9B5C6"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            {/* Bolinhas em HTML: no SVG esticado (preserveAspectRatio="none")
                elas virariam elipses. */}
            {escolhido && (
              <span
                className="pointer-events-none absolute size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{ left: pct(escolhido.x), top: escolhido.y }}
              />
            )}
            {focado && focado !== escolhido && (
              <span
                className="pointer-events-none absolute size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#7B6CF0] bg-white"
                style={{ left: pct(focado.x), top: focado.y }}
              />
            )}

            {/* Eixo dos meses. */}
            {pts.map((p) => (
              <span
                key={p.mes}
                className={cn(
                  "pointer-events-none absolute bottom-0 -translate-x-1/2 text-[11px]",
                  p.mes === mes ? "font-bold text-white" : "text-[#8A8698]",
                )}
                style={{ left: pct(p.x) }}
              >
                {MESES[p.mes - 1].slice(0, 3)}
              </span>
            ))}

            {focado && (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-10 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-[12.5px] text-[#1B1A22] shadow-lg"
                style={{
                  left: pct(focado.x),
                  top: focado.y,
                  // Acima do ponto; nas pontas, encosta para não sair do card.
                  transform: `translate(${
                    focado.x / W < 0.15
                      ? "0"
                      : focado.x / W > 0.85
                        ? "-100%"
                        : "-50%"
                  }, calc(-100% - 12px))`,
                }}
              >
                <p className="capitalize text-[#6B6878]">
                  {MESES[focado.mes - 1]}
                  {focado.mes > corte && " · previsão"}
                </p>
                <p className="font-display text-[15px] font-bold tabular-nums">
                  {formatCurrency(focado.saldo)}
                </p>
                <p
                  className={cn(
                    "tabular-nums",
                    focado.delta >= 0 ? "text-success" : "text-danger",
                  )}
                >
                  {focado.delta >= 0 ? "+" : "−"}
                  {formatCurrency(Math.abs(focado.delta))} no mês
                </p>
              </div>
            )}
          </div>
          <p className="-mt-2 text-[12.5px] text-[#B9B5C6]">
            {corte >= 12
              ? `Saldo no fim de cada mês de ${ano}.`
              : "Saldo no fim de cada mês. Tracejado: previsão com o que já está lançado."}
          </p>
        </div>
      )}
    </section>
  );
};
