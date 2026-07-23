import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import type { TransacaoResponse } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { makePostTransacoesIdPagarFactory } from "@/main/factories/usecases";
import { MonthPicker } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import { useGetTransacoes } from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";

interface ContasAPagarTabProps {
  ano: number;
  mes: number;
  onMonthChange: (mes: number, ano: number) => void;
}

/** Badge de status (statusExibicao): paga verde, atrasada vermelho, pendente âmbar. */
const statusBadge = (statusExibicao: string) => {
  if (statusExibicao === "paga")
    return { label: "paga", cls: "bg-success/10 text-success" };
  if (statusExibicao === "atrasada")
    return { label: "atrasada", cls: "bg-danger/10 text-danger" };
  return { label: "pendente", cls: "bg-warning/10 text-warning" };
};

/** "DD/MM" a partir da data — aceita BR ("28/07/2026") ou ISO ("2026-07-28"). */
const vencimento = (data?: string) => {
  if (!data) return "";
  const br = /^(\d{2})\/(\d{2})\/\d{4}/.exec(data);
  if (br) return `${br[1]}/${br[2]}`;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);
  if (iso) return `${iso[3]}/${iso[2]}`;
  return data;
};

/**
 * Aba "Contas a pagar" — transações pendentes/atrasadas com marcar como paga
 * (POST /transacoes/{id}/pagar). O statusExibicao já deriva "atrasada".
 */
export const ContasAPagarTab = ({
  ano,
  mes,
  onMonthChange,
}: ContasAPagarTabProps) => {
  const queryClient = useQueryClient();

  const inicioMes = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const fimMes = `${ano}-${String(mes).padStart(2, "0")}-${new Date(ano, mes, 0).getDate()}`;

  // status=pendente = todas as não-pagas (no prazo + vencidas). O statusExibicao
  // de cada uma diz se é "pendente" ou "atrasada".
  const { data, isLoading, refetch } = useGetTransacoes({
    page: 1,
    limit: 100,
    status: "pendente",
    startDate: inicioMes,
    endDate: fimMes,
  });

  // "Já pago" no mês — o resume.total já vem somado, então limit 1 basta.
  const { data: pagasData, refetch: refetchPagas } = useGetTransacoes({
    page: 1,
    limit: 1,
    status: "paga",
    startDate: inicioMes,
    endDate: fimMes,
  });
  const totalPago = parseAmount(pagasData?.data?.resume?.total);

  const pagar = useMutation({
    mutationFn: (id: string) =>
      makePostTransacoesIdPagarFactory().pagar({ id }),
    onSuccess: () => {
      toast.success("Conta marcada como paga!");
      refetch();
      refetchPagas();
      queryClient.invalidateQueries({ queryKey: ["get-transacoes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const todas = (data?.data?.rows ?? []) as TransacaoResponse[];
  const atrasadas = todas.filter((c) => c.statusExibicao === "atrasada");
  const noPrazo = todas.filter((c) => c.statusExibicao !== "atrasada");
  // atrasadas primeiro (mais urgentes)
  const contas = [...atrasadas, ...noPrazo];

  const totalAPagar = noPrazo.reduce((s, c) => s + parseAmount(c.valor), 0);
  const totalAtrasado = atrasadas.reduce((s, c) => s + parseAmount(c.valor), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Filtro de mês + Nova conta */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {contas.length} conta{contas.length === 1 ? "" : "s"} pendente
            {contas.length === 1 ? "" : "s"}
          </span>
          <MonthPicker month={mes} year={ano} onChange={onMonthChange} />
        </div>
        <Link
          to={urlRouters.createTransactions}
          className="flex items-center gap-[7px] rounded-[12px] bg-primary px-[17px] py-[11px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          Nova conta
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi
          label="A pagar este mês"
          value={formatCurrency(totalAPagar)}
          color="text-warning"
        />
        <Kpi
          label="Em atraso"
          value={formatCurrency(totalAtrasado)}
          color="text-danger"
        />
        <Kpi
          label="Já pago"
          value={formatCurrency(totalPago)}
          color="text-success"
        />
      </div>

      {/* Lista */}
      <div className="rounded-card border border-line bg-card p-[22px] sm:px-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : contas.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-fg">Tudo em dia! 🎉</p>
            <p className="mt-1 text-sm text-muted">
              Não há contas pendentes neste mês.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {contas.map((c) => {
              const badge = statusBadge(c.statusExibicao);
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-[16px] border border-line bg-card p-[14px_16px]"
                >
                  <button
                    type="button"
                    aria-label="Marcar como paga"
                    disabled={pagar.isPending}
                    onClick={() => pagar.mutate(c.id)}
                    className="grid size-[26px] shrink-0 place-items-center rounded-[8px] border-2 border-line text-transparent transition-colors hover:border-success disabled:opacity-50"
                  >
                    <Check className="size-[14px]" strokeWidth={2.6} />
                  </button>
                  <span
                    className="h-9 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: enhance(c.categoria?.cor) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-fg">
                      {c.descricao}
                    </p>
                    <p className="truncate text-[12px] text-muted">
                      {c.categoria?.nome} · vence {vencimento(c.data)}
                      {c.meioPagamento?.nome
                        ? ` · ${c.meioPagamento.nome}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-pill px-[11px] py-1 text-[11px] font-bold",
                      badge.cls,
                    )}
                  >
                    {badge.label}
                  </span>
                  <span className="shrink-0 font-display text-[14.5px] font-bold text-danger">
                    {formatCurrency(c.valor)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Kpi = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="rounded-[16px] border border-line bg-card px-[18px] py-4">
    <p className="text-[12.5px] font-semibold text-muted">{label}</p>
    <p className={cn("font-display text-[20px] font-bold", color)}>{value}</p>
  </div>
);
