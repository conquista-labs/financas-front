import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { TransacaoResponse } from "@/domain/models";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui";

export type DeleteEscopo = "apenas_esta" | "esta_e_futuras";

interface DeleteTransactionDialogProps {
  /** Transação a excluir; null mantém o diálogo fechado. */
  target: TransacaoResponse | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: (escopo?: DeleteEscopo) => void;
}

/**
 * Confirmação de exclusão. Para uma compra parcelada agrupada
 * (`parcelaGrupoId` + `totalParcelas > 1`), oferece a escolha entre remover só
 * esta parcela ou esta e as próximas do grupo. Para transações comuns, é uma
 * confirmação simples.
 */
export const DeleteTransactionDialog = ({
  target,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteTransactionDialogProps) => {
  const numero = target?.parcelaNumero ?? undefined;
  const total = target?.totalParcelas ?? undefined;
  const isParcelada = Boolean(target?.parcelaGrupoId && total && total > 1);
  // Quantas parcelas seguintes (incluindo esta) seriam removidas.
  const futuras = isParcelada && numero ? total! - numero + 1 : 0;

  const [escopo, setEscopo] = useState<DeleteEscopo>("apenas_esta");

  // Reseta a escolha sempre que abre para outra transação.
  useEffect(() => {
    if (target) setEscopo("apenas_esta");
  }, [target]);

  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[440px] gap-0 rounded-card border-line bg-card p-6">
        <DialogHeader className="mb-4 flex-row items-center gap-3 space-y-0">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-danger/10">
            <AlertTriangle className="size-5 text-danger" strokeWidth={2} />
          </span>
          <DialogTitle className="font-display text-[19px] font-bold text-fg">
            Excluir transação?
          </DialogTitle>
        </DialogHeader>

        <p className="text-[13.5px] leading-relaxed text-muted">
          <strong className="font-semibold text-fg">{target?.descricao}</strong>{" "}
          será removida. Essa ação não pode ser desfeita.
        </p>

        {isParcelada && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[12.5px] font-semibold text-muted">
              Esta é a parcela {numero} de {total}. O que você quer remover?
            </p>
            {(
              [
                {
                  v: "apenas_esta" as const,
                  titulo: "Só esta parcela",
                  desc: `Remove apenas a parcela ${numero}/${total}.`,
                },
                {
                  v: "esta_e_futuras" as const,
                  titulo: `Esta e as próximas (${futuras})`,
                  desc: `Remove esta e as ${futuras - 1} seguinte${
                    futuras - 1 === 1 ? "" : "s"
                  }; mantém as anteriores.`,
                },
              ] as const
            ).map((opt) => {
              const active = escopo === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setEscopo(opt.v)}
                  className={cn(
                    "flex items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/soft"
                      : "border-line bg-card hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "mt-[2px] grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition-colors",
                      active ? "border-primary" : "border-line",
                    )}
                  >
                    {active && (
                      <span className="size-[9px] rounded-full bg-primary" />
                    )}
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold text-fg">
                      {opt.titulo}
                    </span>
                    <span className="mt-[1px] block text-[12px] text-muted">
                      {opt.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-[12px] border border-line bg-card px-5 py-[11px] text-sm font-semibold text-fg transition-colors hover:bg-track disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(isParcelada ? escopo : undefined)}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-[12px] bg-danger px-5 py-[11px] text-sm font-bold text-white transition-colors hover:brightness-95 disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            {isParcelada && escopo === "esta_e_futuras"
              ? `Excluir ${futuras}`
              : "Excluir"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
