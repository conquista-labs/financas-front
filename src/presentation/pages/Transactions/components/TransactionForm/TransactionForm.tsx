import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import type { MeioPagamento } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Combobox, DateField } from "@/presentation/components";
import { Switch, Textarea } from "@/presentation/components/ui";
import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";

import {
  defaultForm,
  schema,
  statusPadraoPorMeio,
} from "./transactionForm.definitions";

export interface TransactionFormValues {
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  formaPagamento?: string;
  data: string;
  descricao: string;
  valor: string;
  observacoes?: string;
  lembrarMe?: boolean;
  status?: string;
  tags?: string[];
}

interface TransactionFormProps {
  defaultValues?: Partial<TransactionFormValues>;
  isPending: boolean;
  /** Se false (Edit), esconde "Salvar e adicionar outra". */
  allowAddAnother?: boolean;
  onSubmit: (
    values: TransactionFormValues,
    options: { onSuccess: () => void },
  ) => void;
}

const OPT_LIMIT = { page: 1, limit: 100 };

const labelCls = "mb-[7px] block text-[12.5px] font-semibold text-muted";
const fieldCls =
  "w-full rounded-[11px] border border-line bg-card px-3 py-[11px] text-sm text-fg outline-none";

/**
 * Formulário completo de transação (nova identidade "Nossa Grana") — tela
 * dedicada de Create/Edit. Card com grid 2 colunas + campos de largura total
 * (Valor, Observações, Tags, Repetição, Lembrar-me). RHF + Yup (schema
 * reaproveitado). Preserva a assinatura onSubmit(values, { onSuccess }).
 */
export const TransactionForm = ({
  defaultValues,
  isPending,
  allowAddAnother = true,
  onSubmit,
}: TransactionFormProps) => {
  const navigate = useNavigate();

  const { data: enums } = useGetEnums();
  const { data: categorias } = useGetCategorias(OPT_LIMIT);
  const { data: pessoas } = useGetPessoas(OPT_LIMIT);
  const { data: meios } = useGetMeiosPagamento(OPT_LIMIT);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    // O schema yup infere os opcionais como `string | undefined` (chave
    // presente), o que atrita com os `?` da interface; o cast reconcilia.
    resolver: yupResolver(schema) as unknown as Resolver<TransactionFormValues>,
    values: { ...defaultForm, ...defaultValues } as TransactionFormValues,
    mode: "onChange",
  });

  const [tagInput, setTagInput] = useState("");
  const tags = watch("tags") ?? [];

  const submit = (keepOpen: boolean) =>
    handleSubmit((values) =>
      onSubmit(values, {
        onSuccess: () => {
          if (keepOpen) reset({ ...defaultForm, pessoaId: values.pessoaId });
          else navigate(urlRouters.transactions);
        },
      }),
    );

  const addTag = () => {
    const normalized = tagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/#/g, "");
    if (normalized && !tags.includes(normalized))
      setValue("tags", [...tags, normalized]);
    setTagInput("");
  };

  const selectOptions = useMemo(
    () => ({
      categoria: (categorias?.data?.rows ?? []).map((c) => ({
        value: c.id,
        label: c.nome,
      })),
      pessoa: (pessoas?.data?.rows ?? []).map((p) => ({
        value: p.id,
        label: p.nome,
      })),
      meio: (meios?.data?.rows ?? []).map((m: MeioPagamento) => ({
        value: m.id,
        label: m.nome,
      })),
      forma: (enums?.data?.formaPagamento ?? []).map((f) => ({
        value: f.value,
        label: f.label,
      })),
    }),
    [
      categorias?.data?.rows,
      pessoas?.data?.rows,
      meios?.data?.rows,
      enums?.data?.formaPagamento,
    ],
  );

  return (
    <div className="animate-om-fade">
      <h1 className="mb-[6px] font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
        {defaultValues?.categoriaId ? "Editar transação" : "Nova transação"}
      </h1>
      <p className="mb-5 text-sm text-muted">
        Formulário completo — meio, forma, observações e lembrete no calendário.
      </p>

      <form className="max-w-[820px] rounded-card border border-line bg-card p-[26px]">
        {/* Grid 2 colunas */}
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
          <ControlledSelect
            name="categoriaId"
            label="Categoria"
            placeholder="Selecione a categoria"
            control={control}
            options={selectOptions.categoria}
            error={errors.categoriaId?.message}
          />
          <ControlledSelect
            name="pessoaId"
            label="Pessoa"
            placeholder="Selecione a pessoa"
            control={control}
            options={selectOptions.pessoa}
            error={errors.pessoaId?.message}
          />
          <ControlledSelect
            name="meioPagamentoId"
            label="Meio de pagamento"
            placeholder="Selecione o meio"
            control={control}
            options={selectOptions.meio}
            error={errors.meioPagamentoId?.message}
            onValueChange={(id) => {
              // Ajusta o status padrão pelo meio (boleto/cheque/crédito = a pagar).
              const nome = selectOptions.meio.find(
                (m: { value: string; label: string }) => m.value === id,
              )?.label;
              setValue("status", statusPadraoPorMeio(nome));
            }}
          />
          <ControlledSelect
            name="formaPagamento"
            label="Forma de pagamento"
            placeholder="Selecione a forma"
            control={control}
            options={selectOptions.forma}
            error={errors.formaPagamento?.message}
          />
          <div>
            <span className={labelCls}>Data</span>
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <DateField
                  value={toISODate(field.value)}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Selecionar"
                />
              )}
            />
            {errors.data && <FieldError>{errors.data.message}</FieldError>}
          </div>
          <div>
            <span className={labelCls}>Descrição</span>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Digite a descrição"
                  className={fieldCls}
                />
              )}
            />
            {errors.descricao && (
              <FieldError>{errors.descricao.message}</FieldError>
            )}
          </div>

          {/* Situação: já paga ou a pagar (conta pendente) */}
          <div>
            <span className={labelCls}>Situação</span>
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                const value = field.value ?? "paga";
                return (
                  <div className="flex gap-1 rounded-[11px] bg-track p-1">
                    {[
                      { v: "paga", label: "Já paga", color: "text-success" },
                      {
                        v: "pendente",
                        label: "A pagar",
                        color: "text-warning",
                      },
                    ].map((opt) => {
                      const active = value === opt.v;
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => field.onChange(opt.v)}
                          className={cn(
                            "flex-1 rounded-[8px] py-[9px] text-sm font-semibold transition-colors",
                            active
                              ? cn(
                                  "bg-card shadow-[0_2px_6px_rgba(0,0,0,.08)]",
                                  opt.color,
                                )
                              : "text-muted",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>

          {/* Valor (ao lado de Situação, no grid) */}
          <div>
            <span className={labelCls}>Valor</span>
            <div className="flex items-center rounded-[11px] border border-line bg-card px-3">
              <span className="font-semibold text-muted">R$</span>
              <Controller
                name="valor"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    inputMode="decimal"
                    placeholder="0,00"
                    className="flex-1 bg-transparent px-2 py-[11px] text-[15px] text-fg outline-none"
                  />
                )}
              />
            </div>
            {errors.valor && <FieldError>{errors.valor.message}</FieldError>}
          </div>
        </div>

        {/* Observações */}
        <div className="mt-[18px]">
          <span className={labelCls}>Observações</span>
          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                rows={3}
                placeholder="Digite as observações"
                className={cn(fieldCls, "resize-y")}
              />
            )}
          />
        </div>

        {/* Tags */}
        <div className="mt-[18px]">
          <span className={labelCls}>Tags</span>
          {tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-[6px] rounded-pill bg-primary-soft py-[5px] pl-[11px] pr-2 text-[12.5px] font-semibold text-primary-strong"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "tags",
                        tags.filter((t) => t !== tag),
                      )
                    }
                    className="grid size-[15px] place-items-center rounded-full bg-primary/20"
                    aria-label={`Remover ${tag}`}
                  >
                    <X className="size-[9px]" strokeWidth={2.6} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex max-w-[420px] gap-[7px]">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Ex: reforma, viagem-praia"
              className={fieldCls}
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-[11px] border border-line bg-track px-4 text-sm font-semibold text-fg"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Lembrar-me no calendário */}
        <Controller
          name="lembrarMe"
          control={control}
          render={({ field }) => (
            <label className="mt-[18px] flex cursor-pointer items-center gap-3">
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
              <span className="text-sm font-semibold text-fg">
                Lembrar-me no calendário
              </span>
            </label>
          )}
        />

        {/* Ações */}
        <div className="mt-[26px] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(urlRouters.transactions)}
            className="rounded-[12px] border border-danger bg-card px-[26px] py-[13px] font-semibold text-danger transition-colors hover:bg-danger/5"
          >
            Cancelar
          </button>
          <div className="flex flex-wrap gap-[10px]">
            {allowAddAnother && (
              <button
                type="button"
                disabled={isPending}
                onClick={submit(true)}
                className="rounded-[12px] border border-primary bg-card px-[22px] py-[13px] font-semibold text-primary transition-colors hover:bg-primary-soft disabled:opacity-60"
              >
                Salvar e adicionar outra
              </button>
            )}
            <button
              type="button"
              disabled={isPending}
              onClick={submit(false)}
              className="rounded-[12px] bg-primary px-8 py-[13px] font-bold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
            >
              {isPending ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/** Converte "yyyy-MM-ddTHH:mm..." ou ISO para "yyyy-MM-dd" (o DateField usa isso). */
const toISODate = (value?: string) => (value ? value.slice(0, 10) : "");

const FieldError = ({ children }: { children?: React.ReactNode }) =>
  children ? (
    <span className="mt-1 block text-xs text-danger">{children}</span>
  ) : null;

interface ControlledSelectProps {
  name: keyof TransactionFormValues;
  label: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  options: { value: string; label: string }[];
  error?: string;
  /** Callback extra ao mudar (além de gravar no form). */
  onValueChange?: (value: string) => void;
}

const ControlledSelect = ({
  name,
  label,
  placeholder,
  control,
  options,
  error,
  onValueChange,
}: ControlledSelectProps) => (
  <div>
    <span className={labelCls}>{label}</span>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Combobox
          options={options}
          value={field.value || undefined}
          onChange={(v) => {
            field.onChange(v);
            onValueChange?.(v);
          }}
          placeholder={placeholder}
          searchPlaceholder={`Buscar ${label.toLowerCase()}…`}
        />
      )}
    />
    {error && <FieldError>{error}</FieldError>}
  </div>
);
