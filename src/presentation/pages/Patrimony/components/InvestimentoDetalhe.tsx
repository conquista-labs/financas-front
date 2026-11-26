import { Pencil } from "lucide-react";
import { useState } from "react";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Skeleton,
} from "@/presentation/components/ui";
import { useGetPatrimonioId } from "@/presentation/hooks/api";

import {
  delta,
  labelMesRef,
  mesAno,
  mostraVariacao,
  rotuloPosicao,
  serieDiaria,
  serieDoHistorico,
  taxaDaPosicao,
  totaisDasPosicoes,
} from "../patrimony.helpers";
import { EvolucaoDiaria } from "./EvolucaoDiaria";

/** "2027-03-15" → "15/03/2027". */
const dataBr = (iso?: string | null) =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : null;

const pctTexto = (v: number) =>
  `${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

const Linha = ({
  rotulo,
  valor,
  tom,
}: {
  rotulo: string;
  valor: React.ReactNode;
  tom?: string;
}) => (
  <div className="flex items-baseline justify-between gap-3 py-[5px] text-[13px]">
    <span className="text-fg2">{rotulo}</span>
    <span className={cn("text-right font-semibold tabular-nums", tom)}>
      {valor}
    </span>
  </div>
);

const Kpi = ({
  rotulo,
  valor,
  sub,
  tom,
}: {
  rotulo: string;
  valor: string;
  /** Linha pequena embaixo (ex.: o percentual). */
  sub?: string;
  tom?: string;
}) => (
  <div className="min-w-0 rounded-[14px] bg-bg px-3 py-[10px]">
    <p className="text-[11.5px] text-fg2">{rotulo}</p>
    <p
      className={cn(
        "mt-[2px] truncate font-display text-[15px] font-bold tabular-nums",
        tom,
      )}
    >
      {valor}
    </p>
    {sub && <p className={cn("text-[11.5px] font-semibold", tom)}>{sub}</p>}
  </div>
);

/**
 * Evolução do valor: dia a dia (linha) quando já há dois dias guardados;
 * mês a mês (barras, últimos 12) para ver mais longe. Com as duas, dá para
 * alternar.
 */
const Evolucao = ({
  id,
  sincronizado,
}: {
  id: string;
  sincronizado: boolean;
}) => {
  const q = useGetPatrimonioId({ id });
  const [escala, setEscala] = useState<"dia" | "mes">("dia");
  if (q.isLoading) return <Skeleton className="h-[150px] rounded-[14px]" />;
  const diaria = serieDiaria(q.data?.data?.valoresDiarios);
  const mensal = serieDoHistorico(q.data?.data?.snapshots);
  const temDia = diaria.length >= 2;
  const temMes = mensal.length >= 2;
  if (!temDia && !temMes)
    return (
      <p className="rounded-[14px] bg-bg px-3 py-4 text-center text-[12.5px] text-fg2">
        {sincronizado
          ? "A evolução dia a dia aparece aqui a partir de amanhã, com a próxima atualização da corretora."
          : "A evolução aparece aqui depois da próxima atualização do valor."}
      </p>
    );
  const verDia = temDia && (escala === "dia" || !temMes);
  return (
    <div className="flex flex-col gap-2">
      {temDia && temMes && (
        <div
          role="tablist"
          aria-label="Escala da evolução"
          className="flex w-fit gap-1 rounded-full bg-track p-1"
        >
          {(
            [
              ["dia", "Dia a dia"],
              ["mes", "Mês a mês"],
            ] as const
          ).map(([v, t]) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={(v === "dia") === verDia}
              onClick={() => setEscala(v)}
              className={cn(
                "h-7 rounded-full px-3 text-[12px] font-semibold transition-colors",
                (v === "dia") === verDia
                  ? "bg-card text-fg shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                  : "text-fg2 hover:text-fg",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      {verDia ? (
        <EvolucaoDiaria serie={diaria} />
      ) : (
        <BarrasMensais serie={mensal} />
      )}
    </div>
  );
};

/** Barras do valor no fim de cada mês (últimos 12). */
const BarrasMensais = ({
  serie,
}: {
  serie: { mes: string; valor: number }[];
}) => {
  const max = Math.max(...serie.map((s) => s.valor), 1);
  return (
    <div className="flex h-[120px] items-end gap-[6px] rounded-[14px] bg-bg px-3 pb-2 pt-3">
      {serie.map((s, i) => (
        <div
          key={s.mes}
          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
          title={`${labelMesRef(s.mes)}: ${formatCurrency(s.valor)}`}
        >
          <div
            className={cn(
              "w-full rounded-t-[4px]",
              i === serie.length - 1 ? "bg-primary" : "bg-primary/35",
            )}
            style={{ height: `${Math.max(4, (s.valor / max) * 84)}px` }}
          />
          <span className="truncate text-[10px] text-fg2">
            {labelMesRef(s.mes).split("/")[0]}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Detalhes de um investimento (painel lateral): quanto vale, quanto foi
 * aplicado e rendeu, a evolução mês a mês e — quando vem da corretora — cada
 * posição com taxa, emissor, vencimento e rendimento.
 */
export const InvestimentoDetalhe = ({
  item,
  onOpenChange,
  onEdit,
}: {
  item: Patrimonio | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: Patrimonio) => void;
}) => {
  const posicoes = item?.posicoes ?? [];
  const { aplicado, rendimento } = totaisDasPosicoes(posicoes);
  const sincronizado = !!item?.pluggyItemId;
  const d = item ? delta(item) : 0;
  const manualComVariacao = !!item && mostraVariacao(item);

  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto border-line bg-card p-0 sm:max-w-[460px]">
        {item && (
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="pr-8">
              <SheetTitle className="font-display text-[20px] font-bold">
                {item.descricao}
              </SheetTitle>
              <SheetDescription className="mt-1 text-[12.5px] text-fg2">
                {item.categoriaFormatada}
                {sincronizado
                  ? ` · pela corretora${item.sincronizadoEm ? `, atualizado ${new Date(item.sincronizadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}` : ""}`
                  : ` · desde ${mesAno(item.dataAquisicao)}`}
              </SheetDescription>
            </div>

            <div>
              <p className="text-[12.5px] text-fg2">Vale hoje</p>
              <p className="font-display text-[34px] font-bold leading-tight -tracking-[0.02em] tabular-nums">
                {formatCurrency(item.valorAtual)}
              </p>
            </div>

            {(sincronizado ? aplicado !== null : manualComVariacao) && (
              <div className="grid grid-cols-2 gap-2">
                <Kpi
                  rotulo="Aplicado"
                  valor={formatCurrency(
                    (sincronizado ? aplicado : item.valorInicial) ?? 0,
                  )}
                />
                {(() => {
                  const r = sincronizado ? rendimento : d;
                  const base = sincronizado ? aplicado : item.valorInicial;
                  if (r === null || r === undefined) return null;
                  return (
                    <Kpi
                      rotulo="Rendeu"
                      valor={`${r >= 0 ? "+ " : "- "}${formatCurrency(Math.abs(r))}`}
                      sub={
                        base
                          ? `${r >= 0 ? "+" : ""}${pctTexto((r / base) * 100)} sobre o aplicado`
                          : undefined
                      }
                      tom={r >= 0 ? "text-success" : "text-danger"}
                    />
                  );
                })()}
              </div>
            )}

            <section>
              <h3 className="mb-2 text-[13px] font-bold">Evolução</h3>
              <Evolucao id={item.id} sincronizado={sincronizado} />
            </section>

            {sincronizado && (
              <section>
                <h3 className="mb-2 text-[13px] font-bold">
                  {posicoes.length === 1
                    ? "1 aplicação"
                    : `${posicoes.length} aplicações`}
                </h3>
                {posicoes.length === 0 ? (
                  <p className="rounded-[14px] bg-bg px-3 py-4 text-center text-[12.5px] text-fg2">
                    Nenhuma posição aplicada agora.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {posicoes.map((p) => {
                      const taxa = taxaDaPosicao(p);
                      const fatia =
                        item.valorAtual > 0
                          ? (p.saldo / item.valorAtual) * 100
                          : 0;
                      return (
                        <li
                          key={p.id}
                          className="rounded-[14px] border border-line px-3 py-[10px]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                className="truncate text-[13.5px] font-semibold"
                                title={p.nome}
                              >
                                {p.nome}
                              </p>
                              <p className="mt-[2px] text-[12px] text-fg2">
                                {[rotuloPosicao(p), taxa]
                                  .filter(Boolean)
                                  .join(" · ")}
                                {p.isentoIr && (
                                  <span className="font-semibold text-success">
                                    {" · isento de IR"}
                                  </span>
                                )}
                              </p>
                            </div>
                            <p className="shrink-0 font-display text-[14px] font-bold tabular-nums">
                              {formatCurrency(p.saldo)}
                            </p>
                          </div>
                          <div
                            className="mt-2 h-[5px] overflow-hidden rounded-full bg-bg"
                            role="img"
                            aria-label={`${pctTexto(fatia)} do total`}
                          >
                            <div
                              className="h-full rounded-full bg-primary/70"
                              style={{ width: `${Math.min(100, fatia)}%` }}
                            />
                          </div>
                          <div className="mt-1 divide-y divide-line2">
                            {p.valorAplicado != null && (
                              <Linha
                                rotulo="Aplicado"
                                valor={formatCurrency(p.valorAplicado)}
                              />
                            )}
                            {p.rendimento != null && (
                              <Linha
                                rotulo="Rendeu"
                                valor={`${p.rendimento >= 0 ? "+ " : "- "}${formatCurrency(Math.abs(p.rendimento))}`}
                                tom={
                                  p.rendimento >= 0
                                    ? "text-success"
                                    : "text-danger"
                                }
                              />
                            )}
                            {p.rentab12m != null && (
                              <Linha
                                rotulo="Últimos 12 meses"
                                valor={pctTexto(p.rentab12m)}
                              />
                            )}
                            {p.impostos != null && p.impostos > 0 && (
                              <Linha
                                rotulo="IR e IOF (se resgatar hoje)"
                                valor={formatCurrency(p.impostos)}
                              />
                            )}
                            {p.emissor && (
                              <Linha rotulo="Emissor" valor={p.emissor} />
                            )}
                            {p.dataAplicacao && (
                              <Linha
                                rotulo="Aplicado em"
                                valor={dataBr(p.dataAplicacao)}
                              />
                            )}
                            {p.carenciaAte && (
                              <Linha
                                rotulo="Carência até"
                                valor={dataBr(p.carenciaAte)}
                              />
                            )}
                            {p.dataVencimento && (
                              <Linha
                                rotulo="Vence em"
                                valor={dataBr(p.dataVencimento)}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {!sincronizado && (
              <section className="divide-y divide-line2">
                {item.valorInicial != null && !manualComVariacao && (
                  <Linha
                    rotulo="Valor aplicado"
                    valor={formatCurrency(item.valorInicial)}
                  />
                )}
                <Linha
                  rotulo="Desde"
                  valor={dataBr(item.dataAquisicao) ?? "—"}
                />
                {item.dataVencimento && (
                  <Linha
                    rotulo="Vence em"
                    valor={dataBr(item.dataVencimento)}
                  />
                )}
              </section>
            )}

            {item.observacoes && (
              <section>
                <h3 className="mb-1 text-[13px] font-bold">Observações</h3>
                <p className="whitespace-pre-line text-[13px] text-fg2">
                  {item.observacoes}
                </p>
              </section>
            )}

            <button
              type="button"
              onClick={() => onEdit(item)}
              className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-[10px] text-sm font-semibold text-fg hover:bg-bg"
            >
              <Pencil className="size-4" strokeWidth={1.9} />
              Editar
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
