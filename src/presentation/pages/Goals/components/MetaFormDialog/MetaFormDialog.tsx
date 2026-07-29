import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { DesejoResponse, MetaResponse } from "@/domain/models";
import { maskCurrencyInput } from "@/lib/format";
import { cn } from "@/lib/utils";
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
import { useGetPessoas } from "@/presentation/hooks/api";

import { useGoalsMutations } from "../../useGoalsMutations";
import {
  emptyForm,
  fromMeta,
  type MetaFormValues,
  schema,
  toRequest,
} from "./metaForm.definitions";

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

const TIPOS = [
  { v: "acumular", label: "Acumular" },
  { v: "quitar", label: "Quitar dívida" },
];

/**
 * Modal de criar/editar meta — e também de promover um desejo (quando `desejo`
 * é passado, pré-preenche título/valor e chama o endpoint de promover). Tipo em
 * pills, valores com máscara BR, data alvo via DateField, tag livre e dono
 * (Casal por padrão). RHF + Yup; persiste via useGoalsMutations.
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
  const pessoaOpts: ComboboxOption[] = [
    { value: "", label: "Casal (os dois)" },
    ...(pessoasData?.data?.rows ?? []).map((p) => ({
      value: p.id,
      label: p.nome,
    })),
  ];

  const initial: MetaFormValues = meta
    ? fromMeta(meta)
    : desejo
      ? {
          ...emptyForm,
          titulo: desejo.titulo,
          valorAlvo:
            desejo.valorEstimado != null ? String(desejo.valorEstimado) : "",
        }
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
    const body = toRequest(v);
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
      promote.mutate({ id: desejo!.id, body }, done);
    } else {
      createMeta.mutate(body, done);
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
                  placeholder="Ex: Reforma da cozinha"
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

          {/* Tipo (pills) — oculto no editar (não muda) */}
          {!isEdit && (
            <div>
              <span className={labelCls}>Tipo</span>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    {TIPOS.map((opt) => {
                      const active = field.value === opt.v;
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => field.onChange(opt.v)}
                          className={cn(
                            "flex-1 rounded-[11px] border py-[11px] text-[13.5px] font-semibold transition-colors",
                            active
                              ? "border-primary bg-primary/soft text-primary-strong"
                              : "border-line bg-card text-fg2 hover:border-primary/40",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          )}

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Valor alvo</span>
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
              <span className={labelCls}>
                {isEdit ? "Já guardado" : "Valor inicial"}
              </span>
              <Controller
                name="valorInicial"
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
                      disabled={isEdit}
                      className="w-full bg-transparent py-[11px] text-sm text-fg outline-none disabled:opacity-60"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Aporte mensal + data alvo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Aporte mensal</span>
              <Controller
                name="aporteMensal"
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
            </div>
            <div>
              <span className={labelCls}>Data alvo</span>
              <Controller
                name="dataAlvo"
                control={control}
                render={({ field }) => (
                  <DateField
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="mês/ano"
                  />
                )}
              />
              {errors.dataAlvo && (
                <span className="mt-1 block text-xs text-danger">
                  {errors.dataAlvo.message}
                </span>
              )}
            </div>
          </div>

          {/* Tag + dono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Tag</span>
              <Controller
                name="tag"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="meta-cozinha"
                    className={fieldCls}
                  />
                )}
              />
              <span className="mt-1 block text-[11px] text-muted">
                Some as transações com essa tag.
              </span>
            </div>
            <div>
              <span className={labelCls}>De quem</span>
              <Controller
                name="pessoaId"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={pessoaOpts}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Casal (os dois)"
                    searchPlaceholder="Buscar pessoa…"
                    inline
                  />
                )}
              />
            </div>
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
