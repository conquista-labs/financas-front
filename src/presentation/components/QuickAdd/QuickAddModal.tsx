import { format, parse } from "date-fns";
import { Check, Minus, Plus, Search, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { enhance } from "@/lib/color";
import { formatCurrency, maskCurrencyInput, parseAmount } from "@/lib/format";
import {
  interpretarLancamento,
  MAX_PARCELAS,
  normalizar,
} from "@/lib/lancamento";
import { cn } from "@/lib/utils";
import { calcularVencimentoFatura } from "@/lib/vencimento";
import { Combobox, DateField } from "@/presentation/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/presentation/components/ui";
import {
  useGetCategorias,
  useGetMeiosPagamento,
  useGetPessoas,
  usePostRecorrencias,
  usePostTransacoes,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";

import {
  type CamposLancamento,
  montarEnvio,
  type Repeticao,
  type Situacao,
  type Tipo,
  validar,
  valorPorParcela,
} from "./lancar.helpers";
import {
  fieldInput,
  fieldLabel,
  pickChip,
  segButton,
  segGroup,
  tokenChip,
} from "./quickAdd.styles";
import { useQuickAdd } from "./QuickAddContext";

const OPT_LIMIT = { page: 1, limit: 100 };
const CATEGORIAS_VISIVEIS = 8;
const EXEMPLOS = [
  "uber 45 pix",
  "mercado 312,45 nubank 3x",
  "padaria 20 ontem",
  "salário 9800",
];

/** Campos que a pessoa ajustou à mão — a frase não sobrescreve mais. */
type Ajustes = Partial<{
  tipo: Tipo;
  valor: string; // mascarado "1.234,56"
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  data: string;
  descricao: string;
  repeticao: Repeticao;
  parcelas: number;
  status: Situacao;
}>;

const hojeISO = () => format(new Date(), "yyyy-MM-dd");
const mascarar = (v: number) => maskCurrencyInput(String(Math.round(v * 100)));
const diaMes = (iso: string) =>
  format(parse(iso, "yyyy-MM-dd", new Date()), "dd/MM");

/**
 * Lançar (⌘K) do "Repaginado": uma barra que entende a frase do jeito que a
 * pessoa falaria ("mercado 312,45 nubank 3x") e preenche valor, categoria,
 * meio, parcelas e data; o resto do formulário fica a um clique. Tudo que a
 * pessoa ajusta à mão vence a frase.
 */
export const QuickAddModal = () => {
  const { open, setOpen, closeQuickAdd } = useQuickAdd();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [frase, setFrase] = useState("");
  const [ajustes, setAjustes] = useState<Ajustes>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [buscaCat, setBuscaCat] = useState("");
  const [todasCats, setTodasCats] = useState(false);
  const [salvo, setSalvo] = useState<string | null>(null);

  const { data: categoriasResp } = useGetCategorias(OPT_LIMIT);
  const { data: pessoasResp } = useGetPessoas(OPT_LIMIT);
  const { data: meiosResp } = useGetMeiosPagamento(OPT_LIMIT);
  const postTransacao = usePostTransacoes();
  const postRecorrencia = usePostRecorrencias();
  const salvando = postTransacao.isPending || postRecorrencia.isPending;

  const categorias = useMemo(
    () => categoriasResp?.data?.rows ?? [],
    [categoriasResp],
  );
  const pessoas = useMemo(() => pessoasResp?.data?.rows ?? [], [pessoasResp]);
  const meios = useMemo(() => meiosResp?.data?.rows ?? [], [meiosResp]);

  // ── Frase → campos ────────────────────────────────────────────────────
  const lido = useMemo(
    () => interpretarLancamento(frase, { categorias, meios, pessoas }),
    [frase, categorias, meios, pessoas],
  );

  const meioPagamentoId = ajustes.meioPagamentoId ?? lido.meioPagamentoId ?? "";
  const meio = meios.find((m) => m.id === meioPagamentoId);
  const credito = meio?.tipo === "credito";
  const tipo = ajustes.tipo ?? lido.tipo ?? "despesa";
  const categoriaLida = categorias.find((c) => c.id === lido.categoriaId);
  const categoriaId =
    ajustes.categoriaId ??
    (categoriaLida?.tipo === tipo ? categoriaLida.id : "");
  const categoria = categorias.find((c) => c.id === categoriaId);
  // Cartão de crédito com vencimento cadastrado cai na data da fatura.
  const dataBase = lido.data ?? hojeISO();
  const naFatura = !ajustes.data && credito && !!meio?.diaVencimento;
  const data =
    ajustes.data ??
    (naFatura
      ? calcularVencimentoFatura(dataBase, meio!.diaVencimento!)
      : dataBase);
  const repeticao = ajustes.repeticao ?? (lido.parcelas ? "parcelar" : "unico");
  // Conta mensal a partir de hoje: a API gera as ocorrências sempre como
  // pendentes (inclusive a de hoje), então "Já paga" não se aplica.
  const mensalAPagar = repeticao === "mensal" && data >= hojeISO();
  const status: Situacao = mensalAPagar
    ? "pendente"
    : (ajustes.status ?? lido.status ?? (credito ? "pendente" : "paga"));
  const parcelas = ajustes.parcelas ?? lido.parcelas ?? 2;
  const valorTexto = ajustes.valor ?? (lido.valor ? mascarar(lido.valor) : "");
  const valor = parseAmount(valorTexto);
  const descricao = ajustes.descricao ?? lido.descricao;
  const pessoaId = ajustes.pessoaId ?? lido.pessoaId ?? "";

  const campos: CamposLancamento = {
    tipo,
    valor,
    categoriaId,
    pessoaId,
    meioPagamentoId,
    data,
    descricao,
    repeticao,
    parcelas,
    status,
    tags,
    observacoes,
  };

  const ajustar = (a: Ajustes) => setAjustes((atual) => ({ ...atual, ...a }));

  // ── Listas ─────────────────────────────────────────────────────────────
  const catsDoTipo = useMemo(
    () =>
      categorias
        .filter((c) => c.tipo === tipo)
        .sort(
          (a, b) =>
            Number(b.favorito) - Number(a.favorito) ||
            a.nome.localeCompare(b.nome, "pt-BR"),
        ),
    [categorias, tipo],
  );
  const catsFiltradas = buscaCat
    ? catsDoTipo.filter((c) =>
        normalizar(c.nome).includes(normalizar(buscaCat)),
      )
    : catsDoTipo;
  const catsVisiveis =
    todasCats || buscaCat
      ? catsFiltradas
      : (() => {
          const primeiras = catsFiltradas.slice(0, CATEGORIAS_VISIVEIS);
          // A escolhida sempre aparece, mesmo fora das primeiras.
          return categoria && !primeiras.includes(categoria)
            ? [...primeiras.slice(0, -1), categoria]
            : primeiras;
        })();
  const escondidas = catsFiltradas.length - catsVisiveis.length;

  const meioOpts = useMemo(
    () => meios.map((m) => ({ value: m.id, label: m.nome })),
    [meios],
  );
  const pessoasOrdenadas = useMemo(
    () => [...pessoas].sort((a, b) => Number(b.favorito) - Number(a.favorito)),
    [pessoas],
  );

  // ── Ciclo de vida ──────────────────────────────────────────────────────
  const limpar = () => {
    setFrase("");
    setAjustes({});
    setTags([]);
    setTagInput("");
    setObservacoes("");
    setBuscaCat("");
    setTodasCats(false);
  };

  useEffect(() => {
    if (open) {
      setSalvo(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const abrirFormCompleto = () => {
    closeQuickAdd();
    navigate(`${urlRouters.createTransactions}${location.search}`);
  };

  const addTag = () => {
    const t = tagInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/#/g, "");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const resumo = () => {
    const partes = [
      `${descricao.trim() || categoria?.nome || "Lançamento"}`,
      repeticao === "parcelar"
        ? `${parcelas}x de ${formatCurrency(valorPorParcela(valor, parcelas))}`
        : formatCurrency(valor),
      repeticao === "mensal" ? "todo mês" : diaMes(data),
      meio?.nome,
    ];
    return partes.filter(Boolean).join(" · ");
  };

  const salvar = async (outra: boolean) => {
    const erro = validar(campos);
    if (erro) return toast.error(erro);
    const envio = montarEnvio(campos, { nomeCategoria: categoria?.nome });
    try {
      if (envio.transacao) await postTransacao.mutateAsync(envio.transacao);
      if (envio.recorrencia)
        await postRecorrencia.mutateAsync(envio.recorrencia);
    } catch {
      return; // o hook já mostrou o erro
    }
    const texto = resumo();
    limpar();
    if (outra) {
      toast.success(`Salvo: ${texto}`);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setSalvo(texto);
    }
  };

  const textoSalvar =
    repeticao === "parcelar"
      ? `Salvar ${parcelas} parcelas`
      : repeticao === "mensal"
        ? "Salvar conta mensal"
        : "Salvar";

  // ── Pílulas do que foi entendido ───────────────────────────────────────
  const tokens: {
    k: string;
    v: string;
    tone: Parameters<typeof tokenChip>[0];
  }[] = [
    {
      k: "tipo",
      v: tipo === "despesa" ? "Despesa" : "Receita",
      tone: { tone: tipo === "despesa" ? "danger" : "success" },
    },
    {
      k: "valor",
      v: valor ? formatCurrency(valor) : "—",
      tone: { tone: "strong" },
    },
    {
      k: "categoria",
      v: categoria?.nome ?? "escolher",
      tone: { tone: "warning" },
    },
    { k: "meio", v: meio?.nome ?? "não informado", tone: { tone: "primary" } },
    ...(repeticao === "parcelar"
      ? [
          {
            k: "parcelas",
            v: `${parcelas}x de ${formatCurrency(valorPorParcela(valor, parcelas))}`,
            tone: { tone: "primary" } as const,
          },
        ]
      : repeticao === "mensal"
        ? [{ k: "repete", v: "todo mês", tone: { tone: "primary" } as const }]
        : []),
    {
      k: "data",
      v: `${data === hojeISO() ? "hoje" : diaMes(data)}${naFatura ? " (fatura)" : ""}`,
      tone: { tone: "neutral" },
    },
    {
      k: "situação",
      v: status === "pendente" ? "A pagar" : "Já paga",
      tone: { tone: status === "pendente" ? "warning" : "success" },
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSalvo(null);
      }}
    >
      <DialogContent className="nice-scroll max-h-[92vh] max-w-[640px] gap-0 overflow-y-auto rounded-[26px] border-line bg-card p-0 text-fg shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]">
        <DialogTitle className="sr-only">Lançar</DialogTitle>

        {salvo ? (
          <div className="flex flex-col items-center gap-[14px] px-8 py-12 text-center">
            <div className="grid size-16 place-items-center rounded-[20px] bg-success/10 text-success">
              <Check className="size-8" strokeWidth={2.6} />
            </div>
            <p className="font-display text-2xl font-bold">Lançamento salvo!</p>
            <p className="text-[14.5px] text-fg2">{salvo}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSalvo(null);
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                className="h-[46px] rounded-[12px] border border-line bg-card px-[18px] text-sm font-semibold"
              >
                Lançar outra
              </button>
              <button
                type="button"
                onClick={() => {
                  closeQuickAdd();
                  navigate(urlRouters.transactions);
                }}
                className="h-[46px] rounded-[12px] bg-primary px-[18px] text-sm font-bold text-white"
              >
                Ver em Transações
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Frase */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-[18px]">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-primary text-white">
                <Plus className="size-[18px]" strokeWidth={2.6} />
              </span>
              <input
                ref={inputRef}
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    salvar(e.metaKey || e.ctrlKey);
                  }
                }}
                placeholder="Ex: mercado 120 nubank 3x"
                aria-label="Descreva o lançamento"
                className="min-w-0 flex-1 bg-transparent font-display text-[22px] font-semibold outline-none placeholder:text-muted"
              />
              <kbd className="rounded-[7px] bg-track px-2 py-[3px] font-sans text-xs text-fg2">
                esc
              </kbd>
            </div>

            <div className="flex flex-col gap-[14px] px-5 py-4">
              {/* O que foi entendido */}
              <div className="flex flex-wrap gap-[6px]" aria-live="polite">
                {tokens.map((t) => (
                  <span key={t.k} className={tokenChip(t.tone)}>
                    <span className="font-medium opacity-70">{t.k}</span> {t.v}
                  </span>
                ))}
              </div>

              {/* Ajuda */}
              {!frase && (
                <div className="flex gap-3 rounded-[14px] border border-primary/20 bg-primary-soft/60 px-[14px] py-3">
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-primary text-sm font-bold text-white"
                  >
                    ?
                  </span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="text-[13px] leading-[1.45] text-fg">
                      <strong>Escreva do jeito que falaria</strong>, em qualquer
                      ordem: o <strong>valor</strong>, uma palavra da{" "}
                      <strong>categoria</strong>, o{" "}
                      <strong>cartão ou banco</strong> e, se for parcelado, as{" "}
                      <strong>parcelas</strong> ("3x"). Cartão de crédito já cai
                      na data da fatura. O que não entender, você ajusta nos
                      campos abaixo.
                    </p>
                    <div className="flex flex-wrap items-center gap-[6px]">
                      <span className="text-xs font-semibold text-fg2">
                        Experimente:
                      </span>
                      {EXEMPLOS.map((x) => (
                        <button
                          key={x}
                          type="button"
                          onClick={() => {
                            setFrase(x);
                            setAjustes({});
                            inputRef.current?.focus();
                          }}
                          className="h-7 rounded-full border border-primary/25 bg-card px-[10px] font-display text-[12.5px] font-semibold text-primary-strong dark:text-[#B3A9FF]"
                        >
                          {x}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo + Situação */}
              <div className="grid grid-cols-2 gap-[10px]">
                <div className={segGroup}>
                  {(
                    [
                      ["despesa", "Despesa", "danger"],
                      ["receita", "Receita", "success"],
                    ] as const
                  ).map(([v, t, tone]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => ajustar({ tipo: v, categoriaId: "" })}
                      className={segButton({ active: tipo === v, tone })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className={segGroup}>
                  {(
                    [
                      ["paga", "Já paga", "success"],
                      ["pendente", "A pagar", "warning"],
                    ] as const
                  ).map(([v, t, tone]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => ajustar({ status: v })}
                      disabled={mensalAPagar && v === "paga"}
                      title={
                        mensalAPagar && v === "paga"
                          ? "Contas mensais entram como A pagar na Agenda"
                          : undefined
                      }
                      className={cn(
                        segButton({ active: status === v, tone }),
                        "disabled:cursor-not-allowed disabled:opacity-40",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor (quando a frase não trouxe, ou para corrigir) */}
              <label className="flex items-center gap-3">
                <span className={cn(fieldLabel, "w-[52px]")}>Valor</span>
                <span className="flex h-[38px] flex-1 items-center gap-2 rounded-[10px] border border-line bg-card px-[10px] focus-within:border-primary">
                  <span className="text-[13px] text-muted">R$</span>
                  <input
                    value={valorTexto}
                    onChange={(e) =>
                      ajustar({ valor: maskCurrencyInput(e.target.value) })
                    }
                    inputMode="decimal"
                    placeholder="0,00"
                    className="min-w-0 flex-1 bg-transparent font-display text-[15px] font-semibold outline-none placeholder:text-muted"
                  />
                </span>
              </label>

              {/* Categoria */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className={fieldLabel}>
                    {catsDoTipo.some((c) => c.favorito)
                      ? "Categoria · favoritas primeiro"
                      : "Categoria"}
                  </span>
                  <label className="flex h-8 w-[220px] max-w-[55%] items-center gap-[6px] rounded-[10px] bg-bg px-[10px]">
                    <Search className="size-[14px] shrink-0 text-muted" />
                    <input
                      type="search"
                      value={buscaCat}
                      onChange={(e) => setBuscaCat(e.target.value)}
                      placeholder={`Buscar entre ${catsDoTipo.length} categorias`}
                      aria-label="Buscar categoria"
                      className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {catsVisiveis.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => ajustar({ categoriaId: c.id })}
                      aria-pressed={c.id === categoriaId}
                      className={pickChip({ active: c.id === categoriaId })}
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: enhance(c.cor) }}
                      />
                      {c.nome}
                      {c.favorito && (
                        <Star
                          className="size-3 fill-star text-star"
                          strokeWidth={0}
                        />
                      )}
                    </button>
                  ))}
                  {buscaCat && !catsFiltradas.length && (
                    <span className="text-[12.5px] text-fg2">
                      Nenhuma categoria com "{buscaCat}".
                    </span>
                  )}
                </div>
                {!buscaCat && (escondidas > 0 || todasCats) && (
                  <button
                    type="button"
                    onClick={() => setTodasCats((v) => !v)}
                    className="self-start px-1 text-[12.5px] font-semibold text-primary-strong dark:text-[#B3A9FF]"
                  >
                    {todasCats
                      ? "ver menos"
                      : `+ ver todas (${catsFiltradas.length})`}
                  </button>
                )}
              </div>

              {/* De quem */}
              {pessoasOrdenadas.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                  <span className={fieldLabel}>De quem</span>
                  <div className="flex flex-wrap gap-[6px]">
                    {pessoasOrdenadas.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          ajustar({ pessoaId: pessoaId === p.id ? "" : p.id })
                        }
                        aria-pressed={p.id === pessoaId}
                        className={pickChip({ active: p.id === pessoaId })}
                      >
                        {p.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meio · Data · Descrição */}
              <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
                <div className="flex flex-col gap-[5px]">
                  <span className={fieldLabel}>Meio</span>
                  <Combobox
                    inline
                    options={meioOpts}
                    value={meioPagamentoId || undefined}
                    onChange={(v) => ajustar({ meioPagamentoId: v })}
                    placeholder="Não informado"
                    clearLabel="Não informado"
                    searchPlaceholder="Buscar meio…"
                  />
                </div>
                <div className="flex flex-col gap-[5px]">
                  <span className={fieldLabel}>Data</span>
                  <DateField
                    inline
                    value={data}
                    onChange={(v) => ajustar({ data: v })}
                  />
                </div>
                <label className="flex flex-col gap-[5px]">
                  <span className={fieldLabel}>Descrição</span>
                  <input
                    value={descricao}
                    onChange={(e) => ajustar({ descricao: e.target.value })}
                    placeholder={categoria?.nome ?? "Opcional"}
                    className={fieldInput}
                  />
                </label>
              </div>

              {/* Repetir */}
              <div className="flex flex-col gap-[6px]">
                <span className={fieldLabel}>Repetir</span>
                <div className="flex flex-wrap items-center gap-[10px]">
                  <div className={segGroup}>
                    {(
                      [
                        ["unico", "Único"],
                        ["mensal", "Mensal"],
                        ["parcelar", "Parcelar"],
                      ] as const
                    ).map(([v, t]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => ajustar({ repeticao: v })}
                        className={segButton({ active: repeticao === v })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {repeticao === "parcelar" && (
                    <span className="flex items-center gap-[6px] text-[13px]">
                      <button
                        type="button"
                        aria-label="Menos parcelas"
                        disabled={parcelas <= 2}
                        onClick={() => ajustar({ parcelas: parcelas - 1 })}
                        className="grid size-[30px] place-items-center rounded-[8px] border border-line bg-card disabled:opacity-40"
                      >
                        <Minus className="size-[14px]" />
                      </button>
                      <strong>{parcelas}x</strong>
                      <button
                        type="button"
                        aria-label="Mais parcelas"
                        disabled={parcelas >= MAX_PARCELAS}
                        onClick={() => ajustar({ parcelas: parcelas + 1 })}
                        className="grid size-[30px] place-items-center rounded-[8px] border border-line bg-card disabled:opacity-40"
                      >
                        <Plus className="size-[14px]" />
                      </button>
                      <span className="text-fg2">
                        de {formatCurrency(valorPorParcela(valor, parcelas))}
                      </span>
                    </span>
                  )}
                  {repeticao === "mensal" && (
                    <span className="text-[13px] text-fg2">
                      todo dia {parse(data, "yyyy-MM-dd", new Date()).getDate()}
                      , entra como A pagar na Agenda
                    </span>
                  )}
                </div>
              </div>

              {/* Mais campos */}
              <details className="rounded-[14px] bg-bg px-[14px] py-[10px]">
                <summary className="cursor-pointer text-[13px] font-semibold">
                  Mais campos (tags, observações)
                </summary>
                <div className="mt-[10px] grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                  <div className="flex flex-col gap-[5px]">
                    <span className={fieldLabel}>Tags</span>
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      onBlur={addTag}
                      placeholder="Ex: viagem-praia (Enter)"
                      className={fieldInput}
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTags(tags.filter((x) => x !== t))}
                            aria-label={`Remover ${t}`}
                            className="rounded-full bg-primary-soft px-2 py-[2px] text-xs font-semibold text-primary-strong dark:text-[#B3A9FF]"
                          >
                            #{t} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <label className="flex flex-col gap-[5px]">
                    <span className={fieldLabel}>Observações</span>
                    <input
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Opcional"
                      className={fieldInput}
                    />
                  </label>
                </div>
              </details>
            </div>

            {/* Rodapé */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-[14px]">
              <button
                type="button"
                onClick={abrirFormCompleto}
                className="text-[13px] font-semibold text-fg2 hover:text-primary"
              >
                Formulário completo
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => salvar(true)}
                  disabled={salvando}
                  title="⌘ + Enter"
                  className="h-11 rounded-[12px] border border-line bg-card px-4 text-sm font-semibold disabled:opacity-60"
                >
                  Salvar e lançar outra
                </button>
                <button
                  type="button"
                  onClick={() => salvar(false)}
                  disabled={salvando}
                  title="Enter"
                  className="h-11 rounded-[12px] bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-strong disabled:opacity-60"
                >
                  {salvando ? "Salvando…" : textoSalvar}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
