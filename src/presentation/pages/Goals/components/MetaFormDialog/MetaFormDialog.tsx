import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  CreateMetaRequest,
  DesejoResponse,
  MetaResponse,
} from "@/domain/models";
import { maskCurrencyInput } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui";
import { useGetPessoas } from "@/presentation/hooks/api";

import { useGoalsMutations } from "../../useGoalsMutations";
import {
  emptyForm,
  fromDesejo,
  fromMeta,
  type MetaFormValues,
  schema,
  toRequest,
} from "./metaForm.definitions";
import { MonthField } from "./MonthField";

/** Sentinela p/ "Casal" — Radix Select não aceita value="" (reservado). */
const CASAL = "__casal__";

interface MetaFormDialogProps {
  /** Meta para editar; ausência = criar. */
  meta?: MetaResponse | null;
  /** Desejo sendo promovido a meta (pré-preenche título/valor). */
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

/**
 * Modal de criar/editar meta — e também de promover um desejo (quando `desejo`
 * é passado, pré-preenche título/valor e chama o endpoint de promover). Meta é
 * só um marco: título, valor, de quem (Casal por padrão) e quando (mês/ano,
 * opcional). RHF + Yup; persiste via useGoalsMutations.
 */
export const MetaFormDialog = ({
  meta,
  desejo,
  open,
  onOpenChange,
}: MetaFormDialogProps) => {
  const { createMeta, updateMeta, promote } = useGoalsMutations();
  const isEdit = !!meta;
  const isPromote = !!desejo;

  const { data: pessoasData } = useGetPessoas(OPT_LIMIT);

  const initial: MetaFormValues = meta
    ? fromMeta(meta)
    : desejo
      ? fromDesejo(desejo.titulo, desejo.valorEstimado)
      : emptyForm;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MetaFormValues>({
    resolver: yupResolver(schema) as never,
    values: initial,
  });

  const close = () => onOpenChange(false);

  const onSubmit = (v: MetaFormValues) => {
    const body = toRequest(v, isEdit);
    const done = {
      onSuccess: () => {
        toast.success(
          isEdit
            ? "Meta atualizada!"
            : isPromote
              ? "Desejo virou meta!"
              : "Meta criada!",
        );
        close();
      },
      onError: (e: Error) => toast.error(e.message),
    };
    if (isEdit) {
      updateMeta.mutate({ id: meta!.id, body }, done);
    } else if (isPromote) {
      // Promover usa o mesmo body (o form nunca produz desejoId).
      promote.mutate({ id: desejo!.id, body: body as CreateMetaRequest }, done);
    } else {
      // Criar nunca manda dataAlvo null (só omite) — ver toRequest.
      createMeta.mutate(body as CreateMetaRequest, done);
    }
  };

  const isPending =
    createMeta.isPending || updateMeta.isPending || promote.isPending;

  const title = isEdit
    ? "Editar meta"
    : isPromote
      ? "Transformar em meta"
      : "Nova meta";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="nice-scroll max-h-[90vh] max-w-[520px] gap-0 overflow-y-auto rounded-card border-line bg-card p-6">
        <div className="mb-[18px] flex items-center justify-between">
          <DialogTitle className="font-display text-[20px] font-bold text-fg">
            {title}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Título */}
          <div>
            <span className={labelCls}>Título</span>
            <Controller
              name="titulo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Ex: Cerca viva"
                  className={fieldCls}
                />
              )}
            />
            {errors.titulo && (
              <span className="mt-1 block text-xs text-danger">
                {errors.titulo.message}
              </span>
            )}
          </div>

          {/* Valor + quando */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Valor</span>
              <Controller
                name="valorAlvo"
                control={control}
                render={({ field }) => (
                  <div className={moneyWrap}>
                    <span className="mr-1 text-sm text-muted">R$</span>
                    <input
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(maskCurrencyInput(e.target.value))
                      }
                      inputMode="decimal"
                      placeholder="0,00"
                      className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                    />
                  </div>
                )}
              />
              {errors.valorAlvo && (
                <span className="mt-1 block text-xs text-danger">
                  {errors.valorAlvo.message}
                </span>
              )}
            </div>
            <div>
              <span className={labelCls}>De quem</span>
              <Controller
                name="pessoaId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || CASAL}
                    onValueChange={(v) => field.onChange(v === CASAL ? "" : v)}
                  >
                    <SelectTrigger className="rounded-[11px] border-line">
                      <SelectValue placeholder="Casal (os dois)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CASAL}>Casal (os dois)</SelectItem>
                      {(pessoasData?.data?.rows ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <span className={labelCls}>Quando (opcional)</span>
            <Controller
              name="dataAlvo"
              control={control}
              render={({ field }) => (
                <MonthField value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-[12px] bg-primary py-[13px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
          >
            {isPending
              ? "Salvando…"
              : isEdit
                ? "Salvar alterações"
                : isPromote
                  ? "Criar meta"
                  : "Criar meta"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
