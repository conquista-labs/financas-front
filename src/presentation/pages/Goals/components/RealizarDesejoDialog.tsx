import { PartyPopper, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { DesejoResponse, RealizarDesejoRequest } from "@/domain/models";
import { maskCurrencyInput, parseAmount } from "@/lib/format";
import { DateField } from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";

import { useGoalsMutations } from "../useGoalsMutations";

interface RealizarDesejoDialogProps {
  desejo: DesejoResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const moneyWrap =
  "flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary";
const hojeISO = () => new Date().toISOString().slice(0, 10);

/**
 * "Já realizei": o desejo foi conquistado sem virar meta (coisa pequena,
 * comprou direto). Pergunta quando e quanto custou; vai para as conquistas.
 */
export const RealizarDesejoDialog = ({
  desejo,
  open,
  onOpenChange,
}: RealizarDesejoDialogProps) => {
  const { realizarDesejo } = useGoalsMutations();
  const [data, setData] = useState(hojeISO());
  const [valor, setValor] = useState("");

  // Aberto de fora (open controlado): reinicia ao abrir, sugerindo o estimado.
  useEffect(() => {
    if (!open) return;
    setData(hojeISO());
    setValor(
      desejo?.valorEstimado
        ? maskCurrencyInput(desejo.valorEstimado.toFixed(2))
        : "",
    );
  }, [open, desejo?.id, desejo?.valorEstimado]);

  const close = () => onOpenChange(false);

  const submit = () => {
    if (!desejo) return;
    const parsed = valor ? parseAmount(valor) : null;
    if (valor && (parsed === null || parsed < 0)) {
      toast.error("Informe um valor válido (ou deixe em branco).");
      return;
    }
    const body: RealizarDesejoRequest = {
      realizadoEm: data,
      ...(parsed !== null ? { valorFinal: parsed } : {}),
    };
    realizarDesejo.mutate(
      { id: desejo.id, body },
      {
        onSuccess: () => {
          toast.success(`"${desejo.titulo}" realizado!`);
          close();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-0 rounded-card border-line bg-card p-6">
        <div className="mb-[6px] flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2 font-display text-[20px] font-bold text-fg">
            <PartyPopper className="size-5 text-success" strokeWidth={2} />
            Já realizei
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
        {desejo && (
          <p className="mb-[18px] text-[13px] text-muted">{desejo.titulo}</p>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Quando</span>
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
          <button
            type="button"
            onClick={submit}
            disabled={realizarDesejo.isPending}
            className="mt-1 w-full rounded-[12px] bg-success py-[13px] text-sm font-semibold text-white transition-colors hover:bg-success/90 disabled:opacity-60"
          >
            {realizarDesejo.isPending ? "Salvando…" : "Marcar como realizado"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
