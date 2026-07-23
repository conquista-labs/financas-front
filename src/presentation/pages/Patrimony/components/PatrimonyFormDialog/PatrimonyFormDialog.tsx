import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { Patrimonio } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";
import { useGetEnums, useGetPessoas } from "@/presentation/hooks/api";

import { usePatrimonyMutations } from "../../usePatrimonyMutations";
import {
  emptyForm,
  fromPatrimonio,
  type PatrimonyFormValues,
  schema,
  toRequest,
} from "./patrimonyForm.definitions";

interface PatrimonyFormDialogProps {
  /** Item para editar; ausência = criar. */
  item?: Patrimonio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const fieldCls =
  "w-full rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm text-fg outline-none placeholder:text-muted focus:border-primary";

const OPT_LIMIT = { page: 1, limit: 100 };

/**
 * Modal de criar/editar patrimônio. Tipo em pills (Ativo/Passivo), categoria e
 * pessoa com busca (Combobox), valores monetários, campos de passivo revelados
 * condicionalmente e observações. RHF + Yup; persiste via usePatrimonyMutations.
 */
export const PatrimonyFormDialog = ({
  item,
  open,
  onOpenChange,
}: PatrimonyFormDialogProps) => {
  const { create, update } = usePatrimonyMutations();
  const isEdit = !!item;

  const { data: enums } = useGetEnums();
  const { data: pessoasData } = useGetPessoas(OPT_LIMIT);

  const categoriaOpts: ComboboxOption[] = (
    enums?.data?.categoriaPatrimonio ?? []
  ).map((c) => ({ value: c.value ?? "", label: c.label ?? "" }));
  const pessoaOpts: ComboboxOption[] = (pessoasData?.data?.rows ?? []).map(
    (p) => ({ value: p.id, label: p.nome }),
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PatrimonyFormValues>({
    resolver: yupResolver(schema) as never,
    values: item ? fromPatrimonio(item) : emptyForm,
  });

  const isPassivo = watch("tipo") === "passivo";
  const close = () => onOpenChange(false);

  const onSubmit = (v: PatrimonyFormValues) => {
    const body = toRequest(v);
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? "Patrimônio atualizado!" : "Patrimônio criado!");
        close();
      },
      onError: (e: Error) => toast.error(e.message),
    };
    if (isEdit) update.mutate({ id: item!.id, body }, done);
    else create.mutate(body, done);
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="nice-scroll max-h-[90vh] max-w-[520px] gap-0 overflow-y-auto rounded-card border-line bg-card p-6">
        <div className="mb-[18px] flex items-center justify-between">
          <DialogTitle className="font-display text-[20px] font-bold text-fg">
            {isEdit ? "Editar item" : "Novo item de patrimônio"}
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
          {/* Tipo (pills) */}
          <div>
            <span className={labelCls}>Tipo</span>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {[
                    { v: "ativo", label: "Ativo" },
                    { v: "passivo", label: "Passivo" },
                  ].map((opt) => {
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

          {/* Categoria */}
          <div>
            <span className={labelCls}>Categoria</span>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={categoriaOpts}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione a categoria"
                  searchPlaceholder="Buscar categoria…"
                  inline
                />
              )}
            />
            {errors.categoria && (
              <span className="mt-1 block text-xs text-danger">
                {errors.categoria.message}
              </span>
            )}
          </div>

          {/* Descrição */}
          <div>
            <span className={labelCls}>Descrição</span>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Ex: Apartamento Centro, Fiat Uno 2020"
                  className={fieldCls}
                />
              )}
            />
            {errors.descricao && (
              <span className="mt-1 block text-xs text-danger">
                {errors.descricao.message}
              </span>
            )}
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Valor atual</span>
              <Controller
                name="valorAtual"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary">
                    <span className="mr-1 text-sm text-muted">R$</span>
                    <input
                      {...field}
                      inputMode="decimal"
                      placeholder="0,00"
                      className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                    />
                  </div>
                )}
              />
              {errors.valorAtual && (
                <span className="mt-1 block text-xs text-danger">
                  {errors.valorAtual.message}
                </span>
              )}
            </div>
            <div>
              <span className={labelCls}>Valor inicial (opcional)</span>
              <Controller
                name="valorInicial"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary">
                    <span className="mr-1 text-sm text-muted">R$</span>
                    <input
                      {...field}
                      inputMode="decimal"
                      placeholder="0,00"
                      className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Data de aquisição + Pessoa */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelCls}>Data de aquisição</span>
              <Controller
                name="dataAquisicao"
                control={control}
                render={({ field }) => (
                  <input {...field} type="date" className={fieldCls} />
                )}
              />
              {errors.dataAquisicao && (
                <span className="mt-1 block text-xs text-danger">
                  {errors.dataAquisicao.message}
                </span>
              )}
            </div>
            <div>
              <span className={labelCls}>Pessoa (opcional)</span>
              <Controller
                name="pessoaId"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={pessoaOpts}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione a pessoa"
                    clearLabel="Ninguém"
                    searchPlaceholder="Buscar pessoa…"
                    inline
                  />
                )}
              />
            </div>
          </div>

          {/* Campos de passivo (condicional) */}
          {isPassivo && (
            <div className="space-y-4 rounded-[12px] bg-danger/10 p-4">
              <p className="text-[12.5px] font-bold text-danger">
                Campos específicos de passivo
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className={labelCls}>Saldo devedor</span>
                  <Controller
                    name="saldoDevedor"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center rounded-[11px] border border-line bg-card px-3 focus-within:border-primary">
                        <span className="mr-1 text-sm text-muted">R$</span>
                        <input
                          {...field}
                          inputMode="decimal"
                          placeholder="0,00"
                          className="w-full bg-transparent py-[11px] text-sm text-fg outline-none"
                        />
                      </div>
                    )}
                  />
                  {errors.saldoDevedor && (
                    <span className="mt-1 block text-xs text-danger">
                      {errors.saldoDevedor.message}
                    </span>
                  )}
                </div>
                <div>
                  <span className={labelCls}>Taxa de juros (% a.m.)</span>
                  <Controller
                    name="taxaJuros"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        inputMode="decimal"
                        placeholder="Ex: 0.8"
                        className={fieldCls}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <span className={labelCls}>Data de vencimento (opcional)</span>
                <Controller
                  name="dataVencimento"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="date" className={fieldCls} />
                  )}
                />
              </div>
            </div>
          )}

          {/* Observações */}
          <div>
            <span className={labelCls}>Observações (opcional)</span>
            <Controller
              name="observacoes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Notas adicionais sobre este item"
                  className={cn(fieldCls, "resize-y")}
                />
              )}
            />
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={close}
              className="rounded-[12px] border border-danger bg-card px-[22px] py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-[12px] bg-primary px-[26px] py-3 text-sm font-bold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
            >
              {isPending ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
