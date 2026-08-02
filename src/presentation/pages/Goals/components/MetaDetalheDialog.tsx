import { X } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type { MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
} from "@/presentation/components/ui";
import { useGetMetaId } from "@/presentation/hooks/api";

import {
  formatEta,
  historicoChartData,
  mesAnoAlvo,
  progressRing,
  ringColorPorTipo,
  statusProgressoMeta,
} from "../goals.helpers";

interface MetaDetalheDialogProps {
  /** Meta base (para render imediato enquanto o detalhe carrega). */
  meta: MetaResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAporte: (meta: MetaResponse) => void;
  onEdit: (meta: MetaResponse) => void;
}

interface TooltipInput {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
}

const ChartTooltip = ({ active, payload }: TooltipInput) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as { mes: string; valor: number };
  return (
    <div className="rounded-[10px] border border-line bg-card px-3 py-2 text-xs shadow-modal">
      <p className="font-semibold text-fg">{row.mes}</p>
      <p className="text-fg2">{formatCurrency(row.valor)}</p>
    </div>
  );
};

/**
 * Detalhe da meta: anel grande + valores, gráfico de barras dos aportes dos
 * últimos 6 meses (Recharts) com linha tracejada do aporte necessário, e dois
 * mini-cards (plano atual / ritmo). Ações Editar e Aportar no rodapé. Carrega
 * histórico via GET /metas/:id; enquanto isso usa a meta base.
 */
export const MetaDetalheDialog = ({
  meta,
  open,
  onOpenChange,
  onAporte,
  onEdit,
}: MetaDetalheDialogProps) => {
  const detalhe = useGetMetaId(
    { id: meta?.id ?? "" },
    { enabled: open && !!meta },
  );

  if (!meta) return null;

  const data = detalhe.data?.data;
  const m = data ?? meta;
  const st = statusProgressoMeta[m.statusProgresso];
  const ring = ringColorPorTipo(m.tipo);
  const pct = Math.round(m.percentual);
  const done = m.statusProgresso === "concluida";

  const chart = data ? historicoChartData(data.historico) : [];
  const needColor =
    m.statusProgresso === "atrasada"
      ? "rgba(183,110,0,.6)"
      : "rgba(18,166,106,.55)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="nice-scroll max-h-[90vh] max-w-[560px] gap-0 overflow-y-auto rounded-[22px] border-line bg-card p-[26px]">
        {/* Cabeçalho */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <DialogTitle className="truncate font-display text-[21px] font-bold -tracking-[0.02em] text-fg">
                {m.titulo}
              </DialogTitle>
              <span
                className={cn(
                  "shrink-0 rounded-full px-[9px] py-[3px] text-[10.5px] font-bold",
                  m.tipo === "quitar"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary",
                )}
              >
                {m.tipo === "quitar" ? "Quitar dívida" : "Acumular"}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-muted">
              Alvo em {mesAnoAlvo(m.dataAlvo)} · {m.pessoa?.nome ?? "Casal"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-bg text-fg2"
          >
            <X className="size-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Anel grande + valores */}
        <div className="flex items-center gap-5">
          <div
            className="grid size-24 shrink-0 place-items-center rounded-full"
            style={{ background: progressRing(pct, ring) }}
          >
            <span className="grid size-[76px] place-items-center rounded-full bg-card">
              <span className="font-display text-[19px] font-bold text-fg">
                {pct}%
              </span>
              <span className="text-[10px] text-muted">
                {m.tipo === "quitar" ? "quitado" : "guardado"}
              </span>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[28px] font-bold -tracking-[0.03em] text-fg">
              {formatCurrency(m.valorAtual)}
            </p>
            <p className="text-[13px] text-muted">
              de {formatCurrency(m.valorAlvo)} · faltam{" "}
              {formatCurrency(m.falta)}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-track">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: ring }}
              />
            </div>
          </div>
        </div>

        {/* Gráfico de aportes */}
        <div className="mt-5 rounded-2xl bg-bg px-5 py-[18px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-fg">
              Aportes dos últimos 6 meses
            </h3>
            {data && (
              <span className="text-xs text-muted">
                média {formatCurrency(data.mediaAportes)}
              </span>
            )}
          </div>

          {detalhe.isLoading ? (
            <Skeleton className="mt-3 h-[104px] rounded-[12px]" />
          ) : (
            <div className="mt-3 h-[104px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chart}
                  margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
                >
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: "rgb(var(--muted))", fontSize: 10.5 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  {!done && m.aporteNecessario > 0 && (
                    <ReferenceLine
                      y={m.aporteNecessario}
                      stroke={needColor}
                      strokeDasharray="4 4"
                      strokeWidth={2}
                    />
                  )}
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgb(var(--track))", opacity: 0.4 }}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]} maxBarSize={34}>
                    {chart.map((_, i) => (
                      <Cell key={i} fill={ring} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {!done && m.aporteNecessario > 0 && (
            <p className="mt-3 flex items-center gap-[6px] text-[12px] text-muted">
              <span
                className="h-[3px] w-[14px] rounded-[2px]"
                style={{ backgroundColor: needColor }}
              />
              Ideal por mês para chegar no prazo:{" "}
              {formatCurrency(m.aporteNecessario)}
            </p>
          )}
        </div>

        {/* Mini-cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-card px-4 py-[14px]">
            <p className="text-[12px] text-muted">Plano atual</p>
            <p className="mt-1 font-display text-[17px] font-bold text-fg">
              {formatCurrency(m.aporteMensal)}/mês
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card px-4 py-[14px]">
            <p className="text-[12px] text-muted">Nesse ritmo</p>
            <p
              className={cn("mt-1 font-display text-[17px] font-bold", st.text)}
            >
              {formatEta(m.etaMeses)}
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary/soft px-3 py-[6px] text-xs font-bold text-primary">
            #{m.tag.nome}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(m)}
              className="rounded-[12px] border border-line bg-card px-[18px] py-[11px] text-sm font-semibold text-fg2 transition-colors hover:bg-bg"
            >
              Editar meta
            </button>
            <button
              type="button"
              onClick={() => onAporte(m)}
              className="rounded-[12px] bg-primary px-[22px] py-[11px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
            >
              Aportar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
