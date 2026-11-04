import { Landmark, Link2, Loader2, Pencil, Trash2 } from "lucide-react";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";

import {
  delta,
  linhasDaLista,
  mesAno,
  valorDivida,
} from "../patrimony.helpers";

/** ISO → "04/11 18:02" (horário local). */
const dataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

interface PatrimonioListProps {
  rows: Patrimonio[];
  isLoading?: boolean;
  /** Id do item sendo excluído (spinner na linha). */
  deletingId?: string;
  onEdit: (item: Patrimonio) => void;
  onDelete: (item: Patrimonio) => void;
}

const actionBtn =
  "grid size-8 place-items-center rounded-[9px] transition-colors disabled:cursor-not-allowed";

/**
 * Lista de itens de patrimônio (card único), uma linha por coisa. Bem com
 * financiamento: uma linha só — quanto é de vocês, quanto vale, quanto deve e
 * a proporção (o financiamento não aparece sozinho). Dívida solta: o saldo
 * devedor em vermelho e quanto já foi pago. Ligado a uma corretora: selo
 * "Pela corretora" e as posições aplicadas.
 */
export const PatrimonioList = ({
  rows,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: PatrimonioListProps) => {
  if (isLoading)
    return (
      <div className="rounded-[20px] border border-line bg-card px-[22px] py-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (!rows.length)
    return (
      <div className="rounded-[20px] border border-dashed border-line bg-card/50 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-fg">Nenhum patrimônio ainda</p>
        <p className="mt-1 text-sm text-muted">
          Adicione seus bens e dívidas para acompanhar seu patrimônio líquido.
        </p>
      </div>
    );

  const porId = new Map(rows.map((r) => [r.id, r]));

  return (
    <div className="rounded-[20px] border border-line bg-card px-[22px] pb-3 pt-[6px]">
      {linhasDaLista(rows).map((item) => {
        const isAtivo = item.tipo === "ativo";
        const d = delta(item);
        // Pela corretora o valor é o saldo de hoje (aplicações e resgates
        // mudam o total): comparar com o valor de compra digitado à mão não
        // diz nada — com tudo resgatado viraria um "prejuízo" falso.
        const semVariacao = !item.valorInicial || !!item.pluggyItemId;
        // Bem financiado: o passivo ligado (para editar) e as contas da linha.
        const fin = isAtivo ? item.financiamento : null;
        const passivoDoBem = fin ? porId.get(fin.id) : undefined;
        const divida = fin ? fin.saldoDevedor : 0;
        const deVoces = item.valorAtual - divida;
        const pctDeVoces =
          fin && item.valorAtual > 0
            ? Math.max(0, Math.min(100, (deVoces / item.valorAtual) * 100))
            : 0;
        // Dívida solta: quanto já foi pago do valor original.
        const jaPago =
          !isAtivo && item.valorInicial
            ? item.valorInicial - valorDivida(item)
            : 0;
        return (
          <div
            key={item.id}
            className="flex items-center gap-[14px] border-b border-line2 py-[15px] last:border-0"
          >
            {/* Tag tipo */}
            <span
              className={cn(
                "shrink-0 rounded-full px-[10px] py-1 text-[11px] font-bold",
                fin
                  ? "bg-warning/10 text-warning"
                  : isAtivo
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger",
              )}
            >
              {fin ? "Financiado" : isAtivo ? "Ativo" : "Dívida"}
            </span>

            {/* Descrição + meta */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-fg">
                {item.descricao}
              </p>
              <p className="text-[12.5px] text-muted">
                {item.categoriaFormatada} · desde {mesAno(item.dataAquisicao)}
                {fin?.taxaJuros
                  ? ` · juros ${fin.taxaJuros.toLocaleString("pt-BR")}% a.a.`
                  : ""}
              </p>
              {fin && (
                <div className="mt-[7px] max-w-[320px]">
                  <div className="flex h-[6px] overflow-hidden rounded-full bg-danger/25">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${pctDeVoces}%` }}
                    />
                  </div>
                  <p className="mt-[3px] text-[11.5px] text-muted">
                    {Math.round(pctDeVoces)}% de vocês ·{" "}
                    {100 - Math.round(pctDeVoces)}% ainda financiado
                  </p>
                </div>
              )}
              {item.pluggyItemId && (
                <div className="mt-[6px]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-[2px] text-[11px] font-bold text-primary">
                    <Link2 className="size-[11px]" strokeWidth={2.4} />
                    Pela corretora
                    {item.sincronizadoEm &&
                      ` · atualizado ${dataHora(item.sincronizadoEm)}`}
                  </span>
                  {(item.posicoes ?? []).length > 0 ? (
                    <ul className="mt-[6px] space-y-[3px]">
                      {item.posicoes!.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between gap-3 text-[12px]"
                        >
                          <span className="min-w-0 truncate text-fg2">
                            {p.nome}
                            {p.dataVencimento &&
                              ` · vence ${mesAno(p.dataVencimento)}`}
                          </span>
                          <span className="shrink-0 font-semibold text-fg">
                            {formatCurrency(p.saldo)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-[4px] text-[12px] text-muted">
                      Nenhuma posição aplicada agora.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Valor + variação */}
            <div className="shrink-0 text-right">
              {fin ? (
                <>
                  <p className="font-display text-[15.5px] font-semibold text-fg">
                    {formatCurrency(deVoces)}
                  </p>
                  <p className="text-[12px] text-muted">
                    vale {formatCurrency(item.valorAtual)}
                  </p>
                  <p className="text-[12px] font-semibold text-danger">
                    deve {formatCurrency(divida)}
                  </p>
                </>
              ) : isAtivo ? (
                <>
                  <p className="font-display text-[15.5px] font-semibold text-fg">
                    {formatCurrency(item.valorAtual)}
                  </p>
                  {!semVariacao && (
                    <p
                      className={cn(
                        "text-[12px] font-semibold",
                        d >= 0 ? "text-success" : "text-danger",
                      )}
                    >
                      {d >= 0 ? "+ " : "- "}
                      {formatCurrency(Math.abs(d))} desde a compra
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-display text-[15.5px] font-semibold text-danger">
                    - {formatCurrency(valorDivida(item))}
                  </p>
                  {jaPago > 0 && (
                    <p className="text-[12px] text-muted">
                      já pago {formatCurrency(jaPago)}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Ações */}
            <div className="flex shrink-0 gap-[5px]">
              {passivoDoBem && (
                <button
                  type="button"
                  aria-label="Editar financiamento"
                  title="Editar financiamento (saldo devedor, juros)"
                  onClick={() => onEdit(passivoDoBem)}
                  className={cn(actionBtn, "bg-bg text-fg2 hover:bg-track")}
                >
                  <Landmark className="size-4" strokeWidth={1.9} />
                </button>
              )}
              <button
                type="button"
                aria-label="Editar"
                title={fin ? "Editar o bem" : "Editar"}
                onClick={() => onEdit(item)}
                className={cn(actionBtn, "bg-bg text-fg2 hover:bg-track")}
              >
                <Pencil className="size-4" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                aria-label="Excluir"
                onClick={() => onDelete(item)}
                disabled={deletingId === item.id}
                className={cn(
                  actionBtn,
                  "bg-danger/10 text-danger hover:bg-danger/15",
                )}
              >
                {deletingId === item.id ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Trash2 className="size-4" strokeWidth={1.9} />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
