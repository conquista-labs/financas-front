import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { makePostTransacoesPagarLoteFactory } from "@/main/factories/usecases";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/presentation/components/ui";

const ISO = "yyyy-MM-dd";

/**
 * Baixa em lote das contas em atraso: marca como pagas todas as pendentes que
 * vencem até a data escolhida (padrão: ontem, ou seja, todas as atrasadas).
 * Para limpar de uma vez meses antigos esquecidos em aberto.
 */
export const BaixaEmLoteDialog = ({
  open,
  onOpenChange,
  totalAtrasadas,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAtrasadas: number;
}) => {
  const queryClient = useQueryClient();
  const ontem = format(subDays(new Date(), 1), ISO);
  const [ate, setAte] = useState(ontem);

  const pagar = useMutation({
    mutationFn: () => makePostTransacoesPagarLoteFactory().pagarLote({ ate }),
    onSuccess: (r) => {
      const n = r?.data?.pagas ?? 0;
      toast.success(
        n === 1
          ? "1 conta marcada como paga."
          : `${n} contas marcadas como pagas.`,
      );
      for (const key of [
        "get-transacoes",
        "get-calendario",
        "get-resumo-financeiro",
      ])
        queryClient.invalidateQueries({ queryKey: [key] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setAte(ontem);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-[420px] rounded-[22px] border-line bg-card">
        <DialogTitle className="font-display text-lg font-bold">
          Marcar atrasadas como pagas
        </DialogTitle>
        <DialogDescription className="text-[13px] leading-relaxed text-fg2">
          Todas as contas em aberto que venceram até a data abaixo viram pagas.
          {totalAtrasadas > 0 &&
            ` Hoje há ${totalAtrasadas} ${totalAtrasadas === 1 ? "conta" : "contas"} em atraso.`}
        </DialogDescription>

        <label className="block">
          <span className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Vencidas até
          </span>
          <input
            type="date"
            value={ate}
            max={ontem}
            onChange={(e) => setAte(e.target.value || ontem)}
            className="w-full max-w-[200px] rounded-[11px] border border-line bg-card px-3 py-[10px] text-sm text-fg outline-none"
          />
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-4 py-[9px] text-sm font-semibold text-fg2 hover:bg-bg"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => pagar.mutate()}
            disabled={pagar.isPending}
            className="flex items-center gap-2 rounded-full bg-success px-4 py-[9px] text-sm font-bold text-white disabled:opacity-60"
          >
            {pagar.isPending && <Loader2 className="size-4 animate-spin" />}
            Marcar como pagas
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
