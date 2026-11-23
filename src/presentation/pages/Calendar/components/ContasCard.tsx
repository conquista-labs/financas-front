import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { TransacaoResponse } from "@/domain/models";
import { formatCurrency, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { makePostTransacoesIdPagarFactory } from "@/main/factories/usecases";
import { Skeleton } from "@/presentation/components/ui";
import { useGetTransacoes } from "@/presentation/hooks/api";

import type { TransacaoDoMes } from "../agenda.helpers";
import { BaixaEmLoteDialog } from "./BaixaEmLoteDialog";

const ISO = "yyyy-MM-dd";
/** "2026-11-05..." → "05/11". */
const ddmm = (iso?: string | null) =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : "";

const Conta = ({
  t,
  paga,
  quando,
  onPagar,
  ocupado,
}: {
  t: Pick<TransacaoResponse, "id" | "descricao" | "valor"> & {
    meioPagamento?: { nome: string } | null;
  };
  paga: boolean;
  quando: string;
  onPagar?: () => void;
  ocupado?: boolean;
}) => (
  <li className="flex items-center gap-3 py-[7px]">
    <button
      type="button"
      role="checkbox"
      aria-checked={paga}
      aria-label={
        paga ? `${t.descricao} paga` : `Marcar ${t.descricao} como paga`
      }
      onClick={onPagar}
      disabled={paga || ocupado}
      className={cn(
        "grid size-[22px] shrink-0 place-items-center rounded-[6px] border-2 transition-colors",
        paga
          ? "border-success bg-success text-white"
          : "border-line bg-card hover:border-success disabled:opacity-50",
      )}
    >
      {paga ? (
        <Check className="size-[14px]" strokeWidth={3} />
      ) : (
        ocupado && <Loader2 className="size-[13px] animate-spin text-fg2" />
      )}
    </button>
    <span className="min-w-0 flex-1">
      <span
        className={cn(
          "block truncate text-[13.5px] font-semibold",
          paga && "text-fg2 line-through",
        )}
      >
        {t.descricao}
      </span>
      <span className="block truncate text-[12px] text-fg2">
        {quando}
        {t.meioPagamento?.nome && ` · ${t.meioPagamento.nome}`}
      </span>
    </span>
    <span className="shrink-0 font-display text-[13.5px] font-bold tabular-nums">
      {formatCurrency(parseAmount(t.valor))}
    </span>
  </li>
);

const Grupo = ({
  titulo,
  tom,
  acao,
  children,
}: {
  titulo: string;
  tom: string;
  /** Ação à direita do título (ex.: "Marcar todas como pagas"). */
  acao?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    {/* Título fixo no topo enquanto a lista rola por dentro do card. */}
    <div className="sticky top-0 z-[1] flex items-center justify-between gap-2 bg-card pb-1">
      <p className={cn("text-[12px] font-bold", tom)}>{titulo}</p>
      {acao}
    </div>
    <ul className="border-t border-line2">{children}</ul>
  </div>
);

/**
 * "Contas a pagar" (coluna da direita da Agenda): em atraso, próximos 15 dias
 * e as pagas no mês. Marcar o checkbox paga a conta (POST /transacoes/:id/pagar).
 */
export const ContasCard = ({
  pagasDoMes,
  carregandoMes,
}: {
  pagasDoMes: TransacaoDoMes[];
  /** As pagas do mês vêm da consulta do mês (da página). */
  carregandoMes?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [baixaEmLote, setBaixaEmLote] = useState(false);
  const hoje = new Date();
  const atrasadas = useGetTransacoes({
    page: 1,
    limit: 50,
    status: "atrasada",
  });
  const proximas = useGetTransacoes({
    page: 1,
    limit: 50,
    status: "pendente",
    startDate: format(hoje, ISO),
    endDate: format(addDays(hoje, 15), ISO),
  });

  const pagar = useMutation({
    mutationFn: (id: string) =>
      makePostTransacoesIdPagarFactory().pagar({ id }),
    onSuccess: () => {
      toast.success("Conta marcada como paga!");
      for (const key of [
        "get-transacoes",
        "get-calendario",
        "get-resumo-financeiro",
      ])
        queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const listaAtrasadas = (atrasadas.data?.data?.rows ??
    []) as TransacaoResponse[];
  const listaProximas = (proximas.data?.data?.rows ??
    []) as TransacaoResponse[];
  const totalAtrasadas = atrasadas.data?.data?.meta?.total ?? 0;
  const carregando =
    atrasadas.isLoading || proximas.isLoading || !!carregandoMes;
  const vazio =
    !listaAtrasadas.length && !listaProximas.length && !pagasDoMes.length;

  return (
    <section className="flex flex-col gap-4 rounded-[22px] border border-line bg-card p-5">
      <h2 className="font-display text-lg font-bold">Contas a pagar</h2>
      {carregando ? (
        <Skeleton className="h-[220px] rounded-[14px]" />
      ) : vazio ? (
        <p className="py-6 text-center text-[13px] text-fg2">
          Nenhuma conta pendente. Use "+ Nova conta" para agendar.
        </p>
      ) : (
        // Lista longa (ex.: muitas compras no cartão) rola por dentro do
        // card em vez de esticar a página.
        <div className="nice-scroll -mr-2 flex max-h-[min(520px,65vh)] flex-col gap-4 overflow-y-auto pr-2">
          {listaAtrasadas.length > 0 && (
            <Grupo
              titulo="Em atraso"
              tom="text-danger"
              acao={
                listaAtrasadas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setBaixaEmLote(true)}
                    className="text-[12px] font-semibold text-primary hover:underline"
                  >
                    Marcar todas como pagas
                  </button>
                )
              }
            >
              {listaAtrasadas.slice(0, 5).map((t) => (
                <Conta
                  key={t.id}
                  t={t}
                  paga={false}
                  quando={`venceu ${ddmm(t.data)}`}
                  onPagar={() => pagar.mutate(t.id)}
                  ocupado={pagar.isPending && pagar.variables === t.id}
                />
              ))}
              {totalAtrasadas > 5 && (
                <li className="py-[6px] text-[12px] font-semibold text-fg2">
                  + {totalAtrasadas - 5} em atraso
                </li>
              )}
            </Grupo>
          )}
          {listaProximas.length > 0 && (
            <Grupo titulo="Próximos 15 dias" tom="text-warning">
              {listaProximas.map((t) => (
                <Conta
                  key={t.id}
                  t={t}
                  paga={false}
                  quando={`vence ${ddmm(t.data)}`}
                  onPagar={() => pagar.mutate(t.id)}
                  ocupado={pagar.isPending && pagar.variables === t.id}
                />
              ))}
            </Grupo>
          )}
          {pagasDoMes.length > 0 && (
            <Grupo titulo="Pagas" tom="text-success">
              {pagasDoMes.map((t) => (
                <Conta
                  key={t.id}
                  t={{ ...t, valor: parseAmount(t.valor) }}
                  paga
                  quando={`pago ${ddmm(t.pagaEm)}`}
                />
              ))}
            </Grupo>
          )}
        </div>
      )}
      <BaixaEmLoteDialog
        open={baixaEmLote}
        onOpenChange={setBaixaEmLote}
        totalAtrasadas={totalAtrasadas}
      />
    </section>
  );
};
