import { Landmark, Loader2, Pencil, Trash2 } from "lucide-react";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/ui";

import {
  COR_DO_GRUPO,
  delta,
  GRUPO_LABEL,
  mesAno,
  mostraVariacao,
  type ResumoGrupo,
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

interface GrupoCardProps {
  grupo: ResumoGrupo;
  /** Lista inteira: é nela que se acha o financiamento de cada bem. */
  rows: Patrimonio[];
  deletingId?: string;
  onEdit: (item: Patrimonio) => void;
  onDelete: (item: Patrimonio) => void;
}

/**
 * Um grupo (Imóveis, Veículos, Investimentos e reservas, Dívidas) com o total
 * de vocês e os itens. Bem financiado: uma linha só, com quanto deve e a barra
 * do quanto já é de vocês. Ações no "⋯".
 */
export const GrupoCard = ({
  grupo,
  rows,
  deletingId,
  onEdit,
  onDelete,
}: GrupoCardProps) => {
  const porId = new Map(rows.map((r) => [r.id, r]));
  const temDivida = grupo.divida > 0;
  const soDividas = grupo.grupo === "dividas";
  return (
    <section className="rounded-[24px] border border-line bg-card px-5 py-[18px]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-[17px] font-bold">
          <span
            className="inline-block size-[10px] rounded-[3px]"
            style={{ backgroundColor: COR_DO_GRUPO[grupo.grupo] }}
            aria-hidden
          />
          {GRUPO_LABEL[grupo.grupo]}
        </h2>
        <span
          className={cn(
            "shrink-0 text-[13px] font-semibold",
            grupo.liquido < 0 ? "text-danger" : "text-fg2",
          )}
        >
          {grupo.liquido < 0 && "- "}
          {formatCurrency(Math.abs(grupo.liquido))}
          {temDivida && !soDividas && " de vocês"}
        </span>
      </div>

      {grupo.linhas.map((item) => {
        const isAtivo = item.tipo === "ativo";
        const fin = isAtivo ? item.financiamento : null;
        const passivoDoBem = fin ? porId.get(fin.id) : undefined;
        const divida = fin ? fin.saldoDevedor : 0;
        const pctDeVoces =
          fin && item.valorAtual > 0
            ? Math.max(
                0,
                Math.min(
                  100,
                  ((item.valorAtual - divida) / item.valorAtual) * 100,
                ),
              )
            : 0;
        const jaPago =
          !isAtivo && item.valorInicial
            ? item.valorInicial - valorDivida(item)
            : 0;
        const d = delta(item);

        // Linha de baixo: o que é / desde quando / juros / quanto é de vocês.
        const posicoes = item.posicoes ?? [];
        const meta = item.pluggyItemId
          ? posicoes.length
            ? posicoes.map((p) => p.nome).join(" · ")
            : "Nenhuma posição aplicada agora"
          : [
              item.categoriaFormatada,
              `desde ${mesAno(item.dataAquisicao)}`,
              fin?.taxaJuros
                ? `juros ${fin.taxaJuros.toLocaleString("pt-BR")}% a.a.`
                : "",
              fin ? `${Math.round(pctDeVoces)}% de vocês` : "",
            ]
              .filter(Boolean)
              .join(" · ");

        // Linha de baixo do valor.
        const sub = fin
          ? { t: `deve ${formatCurrency(divida)}`, c: "text-danger" }
          : item.pluggyItemId
            ? {
                t: `pela corretora${item.sincronizadoEm ? ` · ${dataHora(item.sincronizadoEm)}` : ""}`,
                c: "text-primary-strong dark:text-[#B3A9FF]",
              }
            : isAtivo && mostraVariacao(item)
              ? {
                  t: `${d >= 0 ? "+ " : "- "}${formatCurrency(Math.abs(d))} desde a compra`,
                  c: d >= 0 ? "text-success" : "text-danger",
                }
              : jaPago > 0
                ? { t: `já pago ${formatCurrency(jaPago)}`, c: "text-muted" }
                : null;

        const selo = fin
          ? { t: "Financiado", c: "bg-warning/10 text-warning" }
          : !isAtivo
            ? { t: "Dívida", c: "bg-danger/10 text-danger" }
            : null;

        return (
          <div key={item.id} className="mt-[10px] border-t border-line2 pt-3">
            <div className="flex items-start gap-[10px]">
              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-center gap-[6px] text-[14.5px] font-semibold">
                  <span className="truncate" title={item.descricao}>
                    {item.descricao}
                  </span>
                  {selo && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[7px] py-[2px] text-[11px] font-bold",
                        selo.c,
                      )}
                    >
                      {selo.t}
                    </span>
                  )}
                </p>
                <p
                  className="mt-[2px] truncate text-[12.5px] text-fg2"
                  title={meta}
                >
                  {meta}
                </p>
              </div>
              <div className="max-w-[48%] shrink text-right">
                <p
                  className={cn(
                    "whitespace-nowrap font-display text-base font-bold tabular-nums",
                    !isAtivo && "text-danger",
                  )}
                >
                  {!isAtivo && "- "}
                  {formatCurrency(
                    isAtivo ? item.valorAtual : valorDivida(item),
                  )}
                </p>
                {sub && (
                  <p className={cn("mt-[2px] text-xs font-semibold", sub.c)}>
                    {sub.t}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Mais ações de ${item.descricao}`}
                    disabled={deletingId === item.id}
                    className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-bg text-fg2 transition-colors hover:bg-track data-[state=open]:bg-fg data-[state=open]:text-bg"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <span aria-hidden className="text-base leading-none">
                        ⋯
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuItem onSelect={() => onEdit(item)}>
                    <Pencil className="size-4" strokeWidth={1.9} />
                    Editar
                  </DropdownMenuItem>
                  {passivoDoBem && (
                    <DropdownMenuItem onSelect={() => onEdit(passivoDoBem)}>
                      <Landmark className="size-4" strokeWidth={1.9} />
                      Editar financiamento
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={() => onDelete(item)}
                    className="text-danger focus:text-danger"
                  >
                    <Trash2 className="size-4" strokeWidth={1.9} />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {fin && (
              <div
                className="mt-[10px] flex h-2 overflow-hidden rounded-full bg-danger/15"
                role="img"
                aria-label={`${Math.round(pctDeVoces)}% já é de vocês`}
              >
                <div
                  className="h-full bg-success"
                  style={{ width: `${pctDeVoces}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};
