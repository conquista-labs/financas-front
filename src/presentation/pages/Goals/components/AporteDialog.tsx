import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { CreateAporteRequest, MetaResponse } from "@/domain/models";
import { formatCurrency, maskCurrencyInput, parseAmount } from "@/lib/format";
import {
  Combobox,
  type ComboboxOption,
  DateField,
} from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";
import { useGetMeiosPagamento } from "@/presentation/hooks/api";

import { useGoalsMutations } from "../useGoalsMutations";

interface AporteDialogProps {
  meta: MetaResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const moneyWrap =
  "flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary";

const OPT_LIMIT = { page: 1, limit: 100 };
/** yyyy-mm-dd de hoje sem depender de libs (input date-friendly). */
const hojeISO = () => new Date().toISOString().slice(0, 10);

/**
 * Modal de aporte: valor + data + meio de pagamento (opcional). Cria uma
 * transação com a tag da meta (o back devolve a meta recalculada). Sugere o
 * aporte mensal como valor inicial. Persiste via useGoalsMutations.
 */
export const AporteDialog = ({
  meta,
  open,
  onOpenChange,
}: AporteDialogProps) => {
  const { addAporte } = useGoalsMutations();
  const { data: meiosData } = useGetMeiosPagamento(OPT_LIMIT);

  const meioOpts: ComboboxOption[] = (meiosData?.data?.rows ?? []).map((m) => ({
    value: m.id,
    label: m.nome,
  }));

  const [valor, setValor] = useState("");
  const [data, setData] = useState(hojeISO());
  const [meioPagamentoId, setMeioPagamentoId] = useState("");

  // Reinicia os campos sempre que abre para uma meta (sugere o aporte mensal).
  const reset = () => {
    setValor(meta?.aporteMensal ? String(meta.aporteMensal) : "");
    setData(hojeISO());
    setMeioPagamentoId("");
  };

  const handleOpenChange = (next: boolean) => {
    if (next) reset();
    onOpenChange(next);
  };

  const close = () => onOpenChange(false);

  const submit = () => {
    if (!meta) return;
    const parsed = parseAmount(valor);
    if (!parsed || parsed <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    const body: CreateAporteRequest = {
      valor: parsed,
      data,
      ...(meioPagamentoId ? { meioPagamentoId } : {}),
    };
    addAporte.mutate(
      { id: meta.id, body },
      {
        onSuccess: () => {
          toast.success(`Aporte de ${formatCurrency(parsed)} registrado!`);
          close();
        },
        onError: (e: Error) => toast.error(e.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 rounded-card border-line bg-card p-6">
        <div className="mb-[6px] flex items-center justify-between">
          <DialogTitle className="font-display text-[20px] font-bold text-fg">
            Aportar
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
            {meta.titulo} · faltam {formatCurrency(meta.falta)}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <span className={labelCls}>Valor</span>
            <div className={moneyWrap}>
              <span className="mr-1 text-sm text-muted">R$</span>
              <input
                value={valor}
                onChange={(e) => setValor(maskCurrencyInput(e.target.value))}
                inputMode="decimal"
                placeholder="0,00"
                autoFocus
                className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Data</span>
              <DateField value={data} onChange={setData} />
            </div>
            <div>
              <span className={labelCls}>Meio (opcional)</span>
              <Combobox
                options={meioOpts}
                value={meioPagamentoId}
                onChange={setMeioPagamentoId}
                placeholder="Selecionar"
                searchPlaceholder="Buscar meio…"
                inline
              />
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={addAporte.isPending}
            className="mt-1 w-full rounded-[12px] bg-primary py-[13px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
          >
            {addAporte.isPending ? "Registrando…" : "Registrar aporte"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
