import { Check, Search, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { ConcluirMetaRequest, MetaResponse } from "@/domain/models";
import { formatCurrency, maskCurrencyInput, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DateField } from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";
import { useGetTransacoes } from "@/presentation/hooks/api";

import { dataCurta } from "../goals.helpers";
import { useGoalsMutations } from "../useGoalsMutations";

interface ConcluirMetaDialogProps {
  meta: MetaResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const moneyWrap =
  "flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary";
const hojeISO = () => new Date().toISOString().slice(0, 10);

/**
 * "Concluir meta": conquistada na vida real, mesmo que o dinheiro não tenha
 * passado pela tag. Pergunta quando, quanto custou (opcional) e — opcional —
 * qual foi a compra (busca nas transações; escolher preenche o valor).
 */
export const ConcluirMetaDialog = ({
  meta,
  open,
  onOpenChange,
}: ConcluirMetaDialogProps) => {
  const { concluirMeta } = useGoalsMutations();

  const [data, setData] = useState(hojeISO());
  const [valor, setValor] = useState("");
  const [busca, setBusca] = useState("");
  const [compra, setCompra] = useState<{
    id: string;
    descricao: string;
    data: string;
    valor: number;
  } | null>(null);

  const termo = busca.trim();
  const resultados = useGetTransacoes(
    { page: 1, limit: 6, search: termo, tipo: "despesa" },
    { enabled: open && termo.length >= 2 && !compra },
  );
  const linhas = resultados.data?.data?.rows ?? [];

  // O modal é aberto de fora (open controlado): reinicia ao abrir para uma
  // meta — a busca já começa pelo título dela.
  useEffect(() => {
    if (!open) return;
    setData(hojeISO());
    setValor("");
    setBusca(meta?.titulo ?? "");
    setCompra(null);
  }, [open, meta?.id, meta?.titulo]);

  const close = () => onOpenChange(false);

  const escolher = (t: (typeof linhas)[number]) => {
    setCompra({
      id: t.id,
      descricao: t.descricao,
      data: t.data,
      valor: t.valor,
    });
    if (!valor) setValor(maskCurrencyInput(t.valor.toFixed(2)));
  };

  const submit = () => {
    if (!meta) return;
    const parsed = valor ? parseAmount(valor) : null;
    if (valor && (parsed === null || parsed < 0)) {
      toast.error("Informe um valor válido (ou deixe em branco).");
      return;
    }
    const body: ConcluirMetaRequest = {
      concluidaEm: data,
      ...(parsed !== null ? { valorFinal: parsed } : {}),
      ...(compra ? { compraTransacaoId: compra.id } : {}),
    };
    concluirMeta.mutate(
      { id: meta.id, body },
      {
        onSuccess: () => {
          toast.success(`"${meta.titulo}" conquistada!`);
          close();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-0 rounded-card border-line bg-card p-6">
        <div className="mb-[6px] flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2 font-display text-[20px] font-bold text-fg">
            <Trophy className="size-5 text-success" strokeWidth={2} />
            Concluir meta
          </DialogTitle>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="grid size-[34px] place-items-center rounded-[10px] bg-bg text-fg2"
          >
            <X className="size-4" strokeWidth={2.2} />
          </button>
        </div>
        {meta && (
          <p className="mb-[18px] text-[13px] text-muted">
            {meta.titulo} · pelos aportes: {formatCurrency(meta.valorAtual)} de{" "}
            {formatCurrency(meta.valorAlvo)}
          </p>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Quando conseguiram</span>
              <DateField value={data} onChange={setData} />
            </div>
            <div>
              <span className={labelCls}>Quanto custou (opcional)</span>
              <div className={moneyWrap}>
                <span className="mr-1 text-sm text-muted">R$</span>
                <input
                  value={valor}
                  onChange={(e) => setValor(maskCurrencyInput(e.target.value))}
                  inputMode="decimal"
                  placeholder="0,00"
                  className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <span className={labelCls}>Ligar à compra (opcional)</span>
            {compra ? (
              <div className="flex items-center gap-2 rounded-[11px] border border-success/40 bg-success/5 px-3 py-[10px] text-[13px]">
                <Check
                  className="size-4 shrink-0 text-success"
                  strokeWidth={2.2}
                />
                <span className="min-w-0 flex-1 truncate text-fg">
                  {compra.descricao} · {dataCurta(compra.data)} ·{" "}
                  {formatCurrency(compra.valor)}
                </span>
                <button
                  type="button"
                  onClick={() => setCompra(null)}
                  className="text-[12px] font-semibold text-muted hover:text-fg"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <>
                <div className={moneyWrap}>
                  <Search className="mr-2 size-4 text-muted" strokeWidth={2} />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar a compra pela descrição"
                    className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                  />
                </div>
                {termo.length >= 2 && (
                  <div className="mt-2 max-h-[200px] overflow-y-auto rounded-[11px] border border-line">
                    {resultados.isLoading ? (
                      <p className="px-3 py-[10px] text-[12.5px] text-muted">
                        Buscando…
                      </p>
                    ) : linhas.length === 0 ? (
                      <p className="px-3 py-[10px] text-[12.5px] text-muted">
                        Nenhuma compra com "{termo}".
                      </p>
                    ) : (
                      linhas.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => escolher(t)}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 border-b border-line2 px-3 py-[9px] text-left text-[13px] last:border-b-0 hover:bg-bg",
                          )}
                        >
                          <span className="min-w-0 truncate text-fg">
                            {t.descricao}
                            <span className="ml-1 text-muted">
                              · {dataCurta(t.data)}
                            </span>
                          </span>
                          <span className="shrink-0 font-semibold text-fg">
                            {formatCurrency(t.valor)}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={concluirMeta.isPending}
            className="mt-1 w-full rounded-[12px] bg-success py-[13px] text-sm font-semibold text-white transition-colors hover:bg-success/90 disabled:opacity-60"
          >
            {concluirMeta.isPending ? "Concluindo…" : "Concluir meta"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
