import { format } from "date-fns";
import { Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { CreateTransacaoRequest } from "@/domain/models";
import { enhance } from "@/lib/color";
import { cn } from "@/lib/utils";
import { DateField } from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";
import {
  useGetCategorias,
  useGetPessoas,
  usePostTransacoes,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";

import {
  quickChip,
  quickInput,
  repeatPill,
  segButton,
} from "./quickAdd.styles";
import { useQuickAdd } from "./QuickAddContext";

type Tipo = "despesa" | "receita";
type Repeticao = "unico" | "mensal" | "parcelar";

const OPT_LIMIT = { page: 1, limit: 100 };

/** Modal de Lançamento Rápido (nova identidade). Fiel ao protótipo. */
export const QuickAddModal = () => {
  const { open, setOpen, closeQuickAdd } = useQuickAdd();
  const navigate = useNavigate();

  const openFullForm = () => {
    closeQuickAdd();
    navigate(urlRouters.createTransactions);
  };

  const [tipo, setTipo] = useState<Tipo>("despesa");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pessoaId, setPessoaId] = useState("");
  const [data, setData] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [repeticao, setRepeticao] = useState<Repeticao>("unico");
  const [parcelas, setParcelas] = useState("2");
  const [status, setStatus] = useState<"paga" | "pendente">("paga");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showAllCats, setShowAllCats] = useState(false);

  const { data: categorias } = useGetCategorias(OPT_LIMIT);
  const { data: pessoas } = useGetPessoas(OPT_LIMIT);
  const { mutate: createTransacao, isPending } = usePostTransacoes();

  // Categorias do tipo atual, favoritas primeiro; limita a 6 até "ver todas".
  const catsForTipo = useMemo(
    () =>
      (categorias?.data?.rows ?? [])
        .filter((c) => c.tipo === tipo)
        .sort((a, b) => Number(b.favorito) - Number(a.favorito)),
    [categorias, tipo],
  );
  const visibleCats = showAllCats ? catsForTipo : catsForTipo.slice(0, 6);
  const hiddenCount = catsForTipo.length - visibleCats.length;

  const pessoaRows = pessoas?.data?.rows ?? [];
  const valorNumber = Number(valor.replace(/\./g, "").replace(",", ".")) || 0;

  const reset = () => {
    setTipo("despesa");
    setValor("");
    setCategoriaId("");
    setDescricao("");
    setPessoaId("");
    setData(format(new Date(), "yyyy-MM-dd"));
    setRepeticao("unico");
    setParcelas("2");
    setStatus("paga");
    setTags([]);
    setTagInput("");
    setShowAllCats(false);
  };

  const addTag = () => {
    const normalized = tagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/#/g, "");
    if (normalized && !tags.includes(normalized))
      setTags([...tags, normalized]);
    setTagInput("");
  };

  const formaPagamento = (
    repeticao === "parcelar" ? `parcela${parcelas}x` : "avista"
  ) as CreateTransacaoRequest.FormaPagamentoEnum;

  const handleSave = () => {
    if (valorNumber <= 0) return toast.error("Informe um valor.");
    if (!categoriaId) return toast.error("Escolha uma categoria.");

    createTransacao(
      // Só envia IDs preenchidos: a API valida pessoaId como uuid e responde
      // 500 com "". `id` também é omitido (gerado no POST). O tipo gerado
      // marca esses como obrigatórios — reconciliamos com o cast.
      {
        descricao: descricao || "Lançamento rápido",
        categoriaId,
        valor: valorNumber,
        data: new Date(`${data}T12:00:00`).toISOString(),
        formaPagamento,
        status,
        ...(pessoaId ? { pessoaId } : {}),
        ...(tags.length ? { tags } : {}),
      } as CreateTransacaoRequest,
      {
        onSuccess: () => {
          toast.success("Lançamento salvo!");
          reset();
          closeQuickAdd();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const valorColor = tipo === "receita" ? "rgb(var(--success))" : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="nice-scroll max-h-[92vh] max-w-[480px] overflow-y-auto rounded-[24px] border-line bg-card p-6">
        {/* DialogTitle oculto para acessibilidade (o título visual está abaixo) */}
        <DialogTitle className="sr-only">Lançamento rápido</DialogTitle>
        {/* Header */}
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-[21px] font-bold -tracking-[0.02em] text-fg">
            Lançamento rápido
          </h2>
          <button
            type="button"
            onClick={closeQuickAdd}
            aria-label="Fechar"
            className="grid size-[34px] place-items-center rounded-[10px] bg-bg text-fg2"
          >
            <X className="size-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Tipo (segment) */}
        <div className="my-[14px] flex gap-[6px] rounded-[13px] bg-track p-1">
          {(["despesa", "receita"] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(t);
                setCategoriaId("");
              }}
              className={segButton({ active: tipo === t })}
              style={{
                color:
                  tipo === t
                    ? t === "receita"
                      ? "#12A66A"
                      : "#E5484D"
                    : undefined,
              }}
            >
              {t === "despesa" ? "Despesa" : "Receita"}
            </button>
          ))}
        </div>

        {/* Valor gigante */}
        <div className="py-[6px] text-center">
          <div className="text-[12.5px] font-medium text-muted">Valor</div>
          <div className="mt-[2px] flex items-baseline justify-center gap-[6px]">
            <span className="font-display text-2xl font-semibold text-muted">
              R$
            </span>
            <input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="w-[180px] bg-transparent text-center font-display text-[40px] font-bold -tracking-[0.03em] outline-none placeholder:text-muted"
              style={{ color: valorColor }}
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="mb-2 mt-2 text-[12.5px] font-semibold text-muted">
          Categoria{" "}
          <span className="font-medium opacity-75">
            · favoritas e mais usadas primeiro
          </span>
        </div>
        <div className="nice-scroll -mr-2 flex max-h-[164px] flex-wrap gap-2 overflow-y-auto pr-2">
          {visibleCats.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaId(cat.id)}
              className={quickChip({ active: categoriaId === cat.id })}
            >
              {cat.favorito && (
                <Star className="size-3 fill-star text-star" strokeWidth={0} />
              )}
              <span
                className="size-[10px] rounded-full"
                style={{ backgroundColor: enhance(cat.cor) }}
              />
              {cat.nome}
            </button>
          ))}
          {(hiddenCount > 0 || showAllCats) && (
            <button
              type="button"
              onClick={() => setShowAllCats((s) => !s)}
              className="rounded-pill border border-dashed border-line px-[14px] py-[9px] text-[13px] font-semibold text-primary"
            >
              {showAllCats ? "ver menos" : `+ ver todas (${hiddenCount})`}
            </button>
          )}
        </div>

        {/* Descrição */}
        <div className="mt-4">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Descrição
          </label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Mercado da semana"
            className={quickInput()}
          />
        </div>

        {/* Pessoa */}
        <div className="mt-[14px]">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Pessoa vinculada
          </label>
          <div className="flex flex-wrap gap-[7px]">
            {pessoaRows.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPessoaId(pessoaId === p.id ? "" : p.id)}
                className={quickChip({ active: pessoaId === p.id })}
              >
                {p.favorito && (
                  <Star
                    className="size-3 fill-star text-star"
                    strokeWidth={0}
                  />
                )}
                {p.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="mt-[14px]">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Data
          </label>
          <DateField value={data} onChange={setData} placeholder="Selecionar" />
        </div>

        {/* Repetir */}
        <div className="mt-4">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Repetir
          </label>
          <div className="flex gap-[6px]">
            {(["unico", "mensal", "parcelar"] as Repeticao[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRepeticao(r)}
                className={repeatPill({ active: repeticao === r })}
              >
                {r === "unico"
                  ? "Único"
                  : r === "mensal"
                    ? "Mensal"
                    : "Parcelar"}
              </button>
            ))}
          </div>
          {repeticao === "parcelar" && (
            <div className="mt-[10px] flex items-center gap-[10px] rounded-[12px] bg-track px-[14px] py-[10px]">
              <span className="text-[13px] text-fg2">Parcelas</span>
              <input
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                inputMode="numeric"
                className="w-[54px] rounded-[9px] border border-line bg-card p-2 text-center text-sm font-semibold text-fg outline-none"
              />
              <span className="text-[13px] text-muted">
                de{" "}
                {valorNumber > 0
                  ? `R$ ${(valorNumber / Number(parcelas || 1)).toFixed(2).replace(".", ",")}`
                  : "—"}{" "}
                cada
              </span>
            </div>
          )}
        </div>

        {/* Situação */}
        <div className="mt-4">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Situação
          </label>
          <div className="flex gap-1 rounded-[11px] bg-track p-1">
            {(
              [
                { v: "paga", label: "Já paga", color: "text-success" },
                { v: "pendente", label: "A pagar", color: "text-warning" },
              ] as const
            ).map((opt) => {
              const active = status === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setStatus(opt.v)}
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
        </div>

        {/* Tags */}
        <div className="mt-[14px]">
          <label className="mb-[7px] block text-[12.5px] font-semibold text-muted">
            Tags{" "}
            <span className="font-medium opacity-75">
              · agrupe gastos entre categorias
            </span>
          </label>
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
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="grid size-[15px] place-items-center rounded-full bg-primary/20"
                    aria-label={`Remover ${tag}`}
                  >
                    <X className="size-[9px]" strokeWidth={2.6} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-[7px]">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Ex: viagem-praia"
              className="flex-1 rounded-[11px] border border-line bg-card px-3 py-[10px] text-[13.5px] text-fg outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-[11px] border border-line bg-track px-4 text-[13.5px] font-semibold text-fg"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Salvar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="mt-5 w-full rounded-[14px] bg-primary p-[15px] text-[15.5px] font-bold text-white shadow-primary transition-colors hover:bg-primary-strong disabled:opacity-60"
        >
          {isPending ? "Salvando…" : "Salvar lançamento"}
        </button>
        <p className="mt-[9px] text-center text-[12.5px] text-muted">
          Precisa de mais campos?{" "}
          <button
            type="button"
            onClick={openFullForm}
            className="font-semibold text-primary hover:text-primary-strong hover:underline"
          >
            abrir formulário completo
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};
