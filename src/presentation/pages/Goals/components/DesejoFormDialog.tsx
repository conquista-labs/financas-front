import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
  CreateDesejoRequest,
  DesejoResponse,
  EditDesejoRequest,
} from "@/domain/models";
import { maskCurrencyInput, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Textarea,
} from "@/presentation/components/ui";
import { useGetPessoas } from "@/presentation/hooks/api";

import { iniciais, prioridadeDesejo } from "../goals.helpers";
import { useGoalsMutations } from "../useGoalsMutations";

interface DesejoFormDialogProps {
  desejo?: DesejoResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const fieldCls =
  "w-full rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm text-fg outline-none placeholder:text-muted focus:border-primary";
const moneyWrap =
  "flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary";

const OPT_LIMIT = { page: 1, limit: 100 };
const PRIORIDADES: DesejoResponse.PrioridadeEnum[] = ["alta", "media", "baixa"];

/**
 * Modal de criar/editar desejo: título, nota, valor estimado, prioridade
 * (pills) e — só na criação — quem já vota (chips de pessoa). Editar não mexe
 * em votos (isso é feito nos chips do card). Persiste via useGoalsMutations.
 */
export const DesejoFormDialog = ({
  desejo,
  open,
  onOpenChange,
}: DesejoFormDialogProps) => {
  const { createDesejo, updateDesejo } = useGoalsMutations();
  const isEdit = !!desejo;

  const { data: pessoasData } = useGetPessoas(OPT_LIMIT);
  const pessoas = pessoasData?.data?.rows ?? [];

  const [titulo, setTitulo] = useState("");
  const [nota, setNota] = useState("");
  const [valor, setValor] = useState("");
  const [prioridade, setPrioridade] =
    useState<DesejoResponse.PrioridadeEnum>("media");
  const [votos, setVotos] = useState<string[]>([]);

  // Sincroniza os campos ao abrir/trocar de desejo.
  useEffect(() => {
    if (!open) return;
    setTitulo(desejo?.titulo ?? "");
    setNota(desejo?.nota ?? "");
    setValor(desejo?.valorEstimado != null ? String(desejo.valorEstimado) : "");
    setPrioridade(desejo?.prioridade ?? "media");
    setVotos(desejo?.votos.map((v) => v.pessoaId) ?? []);
  }, [open, desejo]);

  const close = () => onOpenChange(false);

  const toggleVoto = (id: string) =>
    setVotos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const submit = () => {
    if (titulo.trim().length < 2) {
      toast.error("Informe um título.");
      return;
    }
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? "Desejo atualizado!" : "Desejo adicionado!");
        close();
      },
      onError: (e: Error) => toast.error(e.message),
    };

    if (isEdit) {
      const body: EditDesejoRequest = {
        titulo: titulo.trim(),
        prioridade,
        ...(nota ? { nota } : {}),
        ...(valor ? { valorEstimado: parseAmount(valor) } : {}),
      };
      updateDesejo.mutate({ id: desejo!.id, body }, done);
    } else {
      const body: CreateDesejoRequest = {
        titulo: titulo.trim(),
        prioridade,
        ...(nota ? { nota } : {}),
        ...(valor ? { valorEstimado: parseAmount(valor) } : {}),
        ...(votos.length ? { votos } : {}),
      };
      createDesejo.mutate(body, done);
    }
  };

  const isPending = createDesejo.isPending || updateDesejo.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="nice-scroll max-h-[90vh] max-w-[460px] gap-0 overflow-y-auto rounded-card border-line bg-card p-6">
        <div className="mb-[18px] flex items-center justify-between">
          <DialogTitle className="font-display text-[20px] font-bold text-fg">
            {isEdit ? "Editar desejo" : "Novo desejo"}
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

        <div className="space-y-4">
          <div>
            <span className={labelCls}>Título</span>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Sofá novo"
              autoFocus
              className={fieldCls}
            />
          </div>

          <div>
            <span className={labelCls}>Nota (opcional)</span>
            <Textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ex: seccional cinza"
              rows={2}
            />
          </div>

          <div>
            <span className={labelCls}>Valor estimado (opcional)</span>
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

          <div>
            <span className={labelCls}>Prioridade</span>
            <div className="flex gap-2">
              {PRIORIDADES.map((p) => {
                const active = prioridade === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrioridade(p)}
                    className={cn(
                      "flex-1 rounded-[11px] border py-[10px] text-[13px] font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary/soft text-primary-strong"
                        : "border-line bg-card text-fg2 hover:border-primary/40",
                    )}
                  >
                    {prioridadeDesejo[p].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Votos iniciais — só ao criar */}
          {!isEdit && pessoas.length > 0 && (
            <div>
              <span className={labelCls}>Quem já quer?</span>
              <div className="flex flex-wrap gap-2">
                {pessoas.map((p) => {
                  const active = votos.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleVoto(p.id)}
                      className={cn(
                        "flex items-center gap-[7px] rounded-full border px-[10px] py-[6px] text-[12.5px] font-semibold transition-colors",
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-line bg-card text-fg2 hover:border-primary/40",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                          active ? "bg-white/25" : "bg-track text-muted",
                        )}
                      >
                        {iniciais(p.nome)}
                      </span>
                      {p.nome}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="mt-1 w-full rounded-[12px] bg-primary py-[13px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
          >
            {isPending ? "Salvando…" : isEdit ? "Salvar" : "Adicionar desejo"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
