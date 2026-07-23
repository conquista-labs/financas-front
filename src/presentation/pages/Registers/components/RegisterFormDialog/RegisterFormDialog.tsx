import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";

import type { RegisterKind } from "../../useRegisterMutations";
import { useRegisterMutations } from "../../useRegisterMutations";
import { ColorPickerField } from "./ColorPickerField";
import {
  emptyForm,
  type RegisterFormValues,
  schemas,
} from "./registerForm.definitions";

/** Registro sendo editado (subset dos campos das 3 entidades). */
export interface RegisterItem {
  id: string;
  nome: string;
  tipo?: string;
  tetoGasto?: number | string;
  cor?: string;
  email?: string;
  favorito?: boolean;
}

interface RegisterFormDialogProps {
  kind: RegisterKind;
  /** Item para editar; ausência = criar. */
  item?: RegisterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TITLES: Record<RegisterKind, { novo: string; editar: string }> = {
  categoria: { novo: "Nova categoria", editar: "Editar categoria" },
  pessoa: { novo: "Nova pessoa", editar: "Editar pessoa" },
  meio: { novo: "Novo meio de pagamento", editar: "Editar meio de pagamento" },
};

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const fieldCls =
  "w-full rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm text-fg outline-none placeholder:text-muted";

/**
 * Modal único de criar/editar cadastro (categoria/pessoa/meio) — campos
 * condicionais por `kind`, fiel ao protótipo. RHF + Yup; converte teto
 * (string "1.000,00" → number) e persiste via useRegisterMutations.
 */
export const RegisterFormDialog = ({
  kind,
  item,
  open,
  onOpenChange,
}: RegisterFormDialogProps) => {
  const { create, update } = useRegisterMutations(kind);
  const isEdit = !!item;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schemas[kind]) as never,
    values: {
      ...emptyForm[kind],
      ...(item
        ? {
            nome: item.nome,
            tipo: item.tipo,
            tetoGasto: item.tetoGasto != null ? String(item.tetoGasto) : "",
            cor: item.cor,
            email: item.email ?? "",
            favorito: item.favorito,
          }
        : {}),
    } as RegisterFormValues,
  });

  const close = () => onOpenChange(false);

  const buildBody = (v: RegisterFormValues) => {
    if (kind === "categoria")
      return {
        nome: v.nome,
        tipo: v.tipo,
        cor: v.cor,
        ...(v.tetoGasto ? { tetoGasto: parseAmount(v.tetoGasto) } : {}),
      };
    if (kind === "pessoa")
      return { nome: v.nome, ...(v.email ? { email: v.email } : {}) };
    return { nome: v.nome };
  };

  const onSubmit = (v: RegisterFormValues) => {
    const body = buildBody(v);
    const done = {
      onSuccess: () => {
        toast.success(isEdit ? "Cadastro atualizado!" : "Cadastro criado!");
        close();
      },
      onError: (e: Error) => toast.error(e.message),
    };
    if (isEdit)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update.mutate({ id: item!.id, body: body as any }, done);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else create.mutate(body as any, done);
  };

  const isPending = create.isPending || update.isPending;
  const title = TITLES[kind][isEdit ? "editar" : "novo"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-0 rounded-card border-line bg-card p-6">
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nome (sempre) */}
          <div>
            <span className={labelCls}>Nome</span>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Digite o nome"
                  className={fieldCls}
                  autoFocus
                />
              )}
            />
            {errors.nome && (
              <span className="mt-1 block text-xs text-danger">
                {errors.nome.message}
              </span>
            )}
          </div>

          {/* Categoria: Tipo + Teto + Cor */}
          {kind === "categoria" && (
            <>
              <div className="mt-4">
                <span className={labelCls}>Tipo</span>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {[
                        { v: "despesa", label: "Despesa" },
                        { v: "receita", label: "Receita" },
                      ].map((opt) => {
                        const active = field.value === opt.v;
                        return (
                          <button
                            key={opt.v}
                            type="button"
                            onClick={() => field.onChange(opt.v)}
                            className={cn(
                              "flex-1 rounded-[11px] border px-3 py-[10px] text-sm font-semibold transition-colors",
                              active
                                ? "border-primary bg-primary-soft text-primary-strong"
                                : "border-line bg-card text-fg2",
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

              <div className="mt-4">
                <span className={labelCls}>Teto mensal (opcional)</span>
                <div className="flex items-center rounded-[11px] border border-line bg-card px-3">
                  <span className="font-semibold text-muted">R$</span>
                  <Controller
                    name="tetoGasto"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        inputMode="decimal"
                        placeholder="0,00"
                        className="flex-1 bg-transparent px-2 py-[11px] text-sm text-fg outline-none"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mt-4">
                <span className={labelCls}>Cor</span>
                <Controller
                  name="cor"
                  control={control}
                  render={({ field }) => (
                    <ColorPickerField
                      value={field.value || "#6C5CE7"}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </>
          )}

          {/* Pessoa: E-mail */}
          {kind === "pessoa" && (
            <div className="mt-4">
              <span className={labelCls}>E-mail (opcional)</span>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="email@exemplo.com"
                    className={fieldCls}
                  />
                )}
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-danger">
                  {errors.email.message}
                </span>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="mt-6 flex justify-end gap-[10px]">
            <button
              type="button"
              onClick={close}
              className="rounded-[12px] border border-line bg-card px-[22px] py-3 font-semibold text-fg transition-colors hover:border-primary/40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-[12px] bg-primary px-[26px] py-3 font-bold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
            >
              {isPending ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
