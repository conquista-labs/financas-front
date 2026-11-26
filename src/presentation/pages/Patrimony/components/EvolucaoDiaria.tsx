import { useState } from "react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import { diaMesCurto } from "../patrimony.helpers";

/** "2026-11-26" de hoje no fuso do navegador. */
const hojeIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const W = 400;
const H = 112;
const PAD_Y = 10;

/**
 * Linha do valor dia a dia (uma série só, sem legenda). Passar o dedo/mouse
 * mostra o dia e o valor; sem hover, o cabeçalho mostra o último dia e quanto
 * mudou desde o primeiro. A escala parte do menor valor do período (não do
 * zero) — por isso mín./máx. ficam escritos embaixo.
 */
export const EvolucaoDiaria = ({
  serie,
}: {
  serie: { dia: string; valor: number }[];
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const valores = serie.map((s) => s.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  // Valor parado: uma linha reta no meio, não colada na borda.
  const folga = max === min ? Math.max(Math.abs(max) * 0.01, 1) : 0;
  const lo = min - folga;
  const hi = max + folga;
  const x = (i: number) => (i / (serie.length - 1)) * W;
  const y = (v: number) => PAD_Y + (1 - (v - lo) / (hi - lo)) * (H - 2 * PAD_Y);
  const linha = serie
    .map(
      (s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(s.valor).toFixed(1)}`,
    )
    .join(" ");
  const area = `${linha} L${W},${H} L0,${H} Z`;

  const i = hover ?? serie.length - 1;
  const ponto = serie[i];
  const primeiro = serie[0];
  const variacao = ponto.valor - primeiro.valor;

  const aoMover = (ev: React.PointerEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    setHover(Math.round(t * (serie.length - 1)));
  };

  return (
    <div className="rounded-[14px] bg-bg px-3 pb-2 pt-3">
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[12.5px]">
        <span className="text-fg2">
          {ponto.dia === hojeIso() ? "Hoje" : diaMesCurto(ponto.dia)}
          <strong className="ml-2 font-display text-[15px] tabular-nums text-fg">
            {formatCurrency(ponto.valor)}
          </strong>
        </span>
        {i > 0 && (
          <span
            className={cn(
              "font-semibold tabular-nums",
              variacao > 0
                ? "text-success"
                : variacao < 0
                  ? "text-danger"
                  : "text-fg2",
            )}
          >
            {variacao > 0 ? "+ " : variacao < 0 ? "- " : ""}
            {formatCurrency(Math.abs(variacao))}
            <span className="font-normal text-fg2">
              {" "}
              desde {diaMesCurto(primeiro.dia)}
            </span>
          </span>
        )}
      </div>

      <div
        className="relative h-[112px] touch-none"
        onPointerMove={aoMover}
        onPointerDown={aoMover}
        onPointerLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Valor dia a dia, de ${diaMesCurto(primeiro.dia)} a ${diaMesCurto(serie[serie.length - 1].dia)}: de ${formatCurrency(primeiro.valor)} a ${formatCurrency(serie[serie.length - 1].valor)}`}
          className="block overflow-visible"
        >
          <path d={area} fill="rgb(var(--primary))" fillOpacity={0.1} />
          <path
            d={linha}
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Marca do dia: régua + ponto em HTML (o SVG estica e deformaria o círculo). */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 w-px bg-fg2/40",
            hover === null && "hidden",
          )}
          style={{ left: `${(x(i) / W) * 100}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
          style={{
            left: `${(x(i) / W) * 100}%`,
            top: `${(y(ponto.valor) / H) * 100}%`,
          }}
        />
      </div>

      <div className="mt-1 flex justify-between gap-2 text-[10.5px] tabular-nums text-fg2">
        <span>{diaMesCurto(primeiro.dia)}</span>
        <span className="text-muted">
          mín. {formatCurrency(min)} · máx. {formatCurrency(max)}
        </span>
        <span>{diaMesCurto(serie[serie.length - 1].dia)}</span>
      </div>

      <table className="sr-only">
        <caption>Valor por dia</caption>
        <tbody>
          {serie.map((s) => (
            <tr key={s.dia}>
              <th scope="row">{diaMesCurto(s.dia)}</th>
              <td>{formatCurrency(s.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
