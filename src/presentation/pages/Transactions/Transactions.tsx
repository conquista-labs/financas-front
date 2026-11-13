import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { Download, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DateParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

import type { TransacaoResponse } from "@/domain/models";
import { parseAmount } from "@/lib/format";
import { useQuickAdd } from "@/presentation/components/QuickAdd";
import {
  useDeleteTransacoesId,
  useGetRelatorioTransacoes,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { useDebounce, usePagination } from "@/presentation/hooks/core";
import { urlRouters } from "@/presentation/router/router.definitions";

import {
  type DeleteEscopo,
  DeleteTransactionDialog,
} from "./components/DeleteTransactionDialog";
import { DetailPanel } from "./components/DetailPanel";
import { FilterBar,type FiltrosBarra } from "./components/FilterBar";
import type { TransactionFilters } from "./components/FiltersSheet";
import { FiltersSheet } from "./components/FiltersSheet";
import { ListaPorDia } from "./components/ListaPorDia";
import { MonthSelector } from "./components/MonthSelector";
import { SelectionBar } from "./components/SelectionBar";
import { TotaisPeriodo } from "./components/TotaisPeriodo";
import { ehReceita } from "./transactions.helpers";
import { useTransacaoMutations } from "./useTransacaoMutations";

const POR_PAGINA = [25, 50, 100];
const plural = (n: number, s: string, p = `${s}s`) => `${n} ${n === 1 ? s : p}`;

/**
 * Transações do "Repaginado": filtros sempre à vista, totais do período,
 * lista agrupada por dia (com fatura), seleção em lote e o painel de
 * detalhes que salva sozinho. Filtros e paginação ficam na URL.
 */
const Transactions = () => {
  const navigate = useNavigate();
  const { openQuickAdd } = useQuickAdd();
  const { atualizar, excluir } = useTransacaoMutations();
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TransacaoResponse | null>(
    null,
  );
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [abertaId, setAbertaId] = useState<string>();

  const [q, setQ] = useQueryParams({
    startDate: withDefault(DateParam, startOfMonth(new Date())),
    endDate: DateParam,
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
    tag: withDefault(StringParam, ""),
    search: withDefault(StringParam, ""),
    tipo: withDefault(StringParam, ""),
    status: withDefault(StringParam, ""),
    createdAtStart: withDefault(StringParam, ""),
    createdAtEnd: withDefault(StringParam, ""),
  });
  const { page, pageSize, onChangePage, onChangePageSize } = usePagination();
  const irParaPagina1 = () => onChangePage({ page: 1, pageSize });

  // Busca com debounce (input imediato, consulta após 300ms).
  const [busca, setBusca] = useState(q.search ?? "");
  const buscaDebounced = useDebounce(busca, 300);
  useEffect(() => {
    if (buscaDebounced !== q.search) {
      setQ({ search: buscaDebounced });
      irParaPagina1();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscaDebounced]);

  // Filtrar por cadastro ignora o período da transação (quase nunca se cruzam).
  const porCadastro = Boolean(q.createdAtStart || q.createdAtEnd);
  const params = useMemo(
    () => ({
      ...q,
      startDate: porCadastro ? "" : format(q.startDate, "yyyy-MM-dd"),
      endDate: !porCadastro && q.endDate ? format(q.endDate, "yyyy-MM-dd") : "",
    }),
    [q, porCadastro],
  );

  const { data, isLoading } = useGetTransacoes({
    page,
    limit: pageSize,
    ...params,
  });
  // O resume.total soma receitas e despesas juntas; para os cartões, uma
  // consulta leve (limit 1) por tipo.
  const entradasQ = useGetTransacoes(
    { page: 1, limit: 1, ...params, tipo: "receita" },
    { enabled: params.tipo !== "despesa" },
  );
  const saidasQ = useGetTransacoes(
    { page: 1, limit: 1, ...params, tipo: "despesa" },
    { enabled: params.tipo !== "receita" },
  );
  const entradas =
    params.tipo === "despesa"
      ? 0
      : parseAmount(entradasQ.data?.data?.resume?.total);
  const saidas =
    params.tipo === "receita"
      ? 0
      : parseAmount(saidasQ.data?.data?.resume?.total);

  const { refetch: buscarRelatorio, isFetching: exportando } =
    useGetRelatorioTransacoes(
      { page, limit: pageSize, ...params },
      { enabled: false },
    );
  const { mutate: excluirComEscopo, isPending: excluindo } =
    useDeleteTransacoesId();

  const linhas = useMemo(
    () => (data?.data?.rows ?? []) as TransacaoResponse[],
    [data],
  );
  const total = data?.data?.meta?.total ?? 0;
  const ultimaPagina = Math.max(1, Math.ceil(total / pageSize));
  const aberta = linhas.find((t) => t.id === abertaId);

  // ── Filtros ────────────────────────────────────────────────────────────
  const filtrosBarra: FiltrosBarra = {
    tipo: q.tipo,
    categoriaId: q.categoriaId,
    pessoaId: q.pessoaId,
    meioPagamentoId: q.meioPagamentoId,
    formaPagamento: q.formaPagamento,
    tag: q.tag,
    status: q.status,
  };
  const mudarFiltros = (patch: Partial<FiltrosBarra>) => {
    setQ(patch);
    irParaPagina1();
    setSelecionados(new Set());
  };
  const limparTudo = () => {
    setBusca("");
    setQ({
      search: "",
      tipo: "",
      categoriaId: "",
      pessoaId: "",
      meioPagamentoId: "",
      formaPagamento: "",
      tag: "",
      status: "",
      createdAtStart: "",
      createdAtEnd: "",
    });
    irParaPagina1();
  };
  const filtrosPainel: TransactionFilters = {
    ...filtrosBarra,
    startDate: params.startDate,
    endDate: params.endDate,
    createdAtStart: q.createdAtStart,
    createdAtEnd: q.createdAtEnd,
  };
  const aplicarPainel = (f: TransactionFilters) => {
    setQ({ createdAtStart: f.createdAtStart, createdAtEnd: f.createdAtEnd });
    irParaPagina1();
    setCadastroAberto(false);
  };

  const mudarMes = (passo: number) => {
    const inicio = startOfMonth(addMonths(q.startDate, passo));
    setQ({ startDate: inicio, endDate: endOfMonth(inicio) });
    irParaPagina1();
    setSelecionados(new Set());
  };

  // ── Ações ──────────────────────────────────────────────────────────────
  const exportar = async () => {
    try {
      const { data: relatorio } = await buscarRelatorio();
      const blob = new Blob([relatorio as unknown as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transacoes.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Não foi possível exportar o relatório.");
    }
  };

  const confirmarExclusao = (escopo?: DeleteEscopo) => {
    if (!deleteTarget) return;
    excluirComEscopo(
      { id: deleteTarget.id, ...(escopo ? { escopo } : {}) },
      {
        onSuccess: () => {
          if (deleteTarget.id === abertaId) setAbertaId(undefined);
          setDeleteTarget(null);
          toast.success(
            escopo === "esta_e_futuras"
              ? "Parcelas excluídas"
              : "Transação excluída",
          );
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  const selecionadas = linhas.filter((t) => selecionados.has(t.id));
  const tipos = new Set(
    selecionadas.map((t) => (ehReceita(t) ? "receita" : "despesa")),
  );
  const ids = selecionadas.map((t) => t.id);
  const emLote = (
    body: Parameters<typeof atualizar.mutate>[0]["body"],
    msg: string,
  ) =>
    atualizar.mutate(
      { ids, body },
      {
        onSuccess: () =>
          toast.success(
            `${plural(ids.length, "transação atualizada", "transações atualizadas")} · ${msg}`,
          ),
        onError: () =>
          toast.error("Algumas não foram atualizadas. Tente de novo."),
      },
    );
  const tagEmLote = async (tag: string) => {
    try {
      await Promise.all(
        selecionadas.map((t) =>
          atualizar.mutateAsync({
            ids: [t.id],
            body: { tags: [...new Set([...(t.tags ?? []), tag])] },
          }),
        ),
      );
      toast.success(
        `#${tag} em ${plural(ids.length, "transação", "transações")}`,
      );
    } catch {
      toast.error("Não foi possível marcar todas. Tente de novo.");
    }
  };
  const excluirEmLote = () =>
    excluir.mutate(ids, {
      onSuccess: () => {
        toast.success(
          `${plural(ids.length, "transação excluída", "transações excluídas")}`,
        );
        if (abertaId && selecionados.has(abertaId)) setAbertaId(undefined);
        setSelecionados(new Set());
      },
      onError: () => toast.error("Algumas não foram excluídas. Tente de novo."),
    });

  return (
    <div className="flex flex-wrap items-start gap-5 pb-8">
      <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-[14px]">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-[30px] font-bold -tracking-[0.03em] text-fg">
            Transações
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <MonthSelector
              startDate={q.startDate}
              endDate={q.endDate ?? undefined}
              onPrev={() => mudarMes(-1)}
              onNext={() => mudarMes(1)}
              onRangeChange={(inicio, fim) => {
                setQ({ startDate: inicio, endDate: fim });
                irParaPagina1();
              }}
              disabled={porCadastro}
            />
            <button
              type="button"
              onClick={exportar}
              disabled={exportando}
              className="flex h-[42px] items-center gap-[6px] rounded-full border border-line bg-card px-[14px] text-sm font-semibold hover:border-primary/40 disabled:opacity-60"
            >
              <Download className="size-4" />
              {exportando ? "Exportando…" : "Exportar"}
            </button>
            <button
              type="button"
              onClick={openQuickAdd}
              className="flex h-[42px] items-center gap-[6px] rounded-full bg-primary px-4 text-sm font-bold text-white shadow-primary hover:bg-primary-strong"
            >
              <Plus className="size-4" strokeWidth={2.6} /> Lançar
            </button>
          </div>
        </header>

        <FilterBar
          busca={busca}
          onBuscaChange={setBusca}
          filtros={filtrosBarra}
          onChange={mudarFiltros}
          onLimpar={limparTudo}
          onMaisFiltros={() => setCadastroAberto(true)}
          maisFiltrosAtivos={
            [q.createdAtStart, q.createdAtEnd].filter(Boolean).length
          }
        />

        <TotaisPeriodo
          entradas={entradas}
          saidas={saidas}
          quantidade={total}
          isLoading={isLoading}
        />

        {selecionadas.length > 0 && (
          <SelectionBar
            quantidade={selecionadas.length}
            tipo={
              tipos.size === 1
                ? ([...tipos][0] as "receita" | "despesa")
                : undefined
            }
            ocupado={atualizar.isPending || excluir.isPending}
            onCategoria={(categoriaId) =>
              emLote({ categoriaId }, "categoria trocada")
            }
            onPessoa={(pessoaId) => emLote({ pessoaId }, "pessoa trocada")}
            onTag={tagEmLote}
            onExcluir={excluirEmLote}
            onCancelar={() => setSelecionados(new Set())}
          />
        )}

        <ListaPorDia
          linhas={linhas}
          isLoading={isLoading}
          selecionados={selecionados}
          abertaId={abertaId}
          onToggle={(id) =>
            setSelecionados((prev) => {
              const s = new Set(prev);
              if (s.has(id)) s.delete(id);
              else s.add(id);
              return s;
            })
          }
          onAbrir={(t) => setAbertaId(t.id === abertaId ? undefined : t.id)}
          vazio={
            <p className="px-[18px] py-10 text-center text-sm text-fg2">
              Nada com esses filtros.{" "}
              <button
                type="button"
                onClick={limparTudo}
                className="font-semibold text-primary hover:underline dark:text-[#B3A9FF]"
              >
                Limpar filtros
              </button>
            </p>
          }
          rodape={
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line2 px-[18px] py-3 text-[13px] text-fg2">
              <span className="flex items-center gap-2">
                Mostrando {linhas.length} de {total} ·
                <select
                  aria-label="Por página"
                  value={pageSize}
                  onChange={(e) => {
                    onChangePageSize(Number(e.target.value));
                    onChangePage({ page: 1, pageSize: Number(e.target.value) });
                  }}
                  className="h-[30px] rounded-[8px] border border-line bg-card px-1"
                >
                  {POR_PAGINA.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                por página
              </span>
              <span className="flex items-center gap-[6px]">
                <span>
                  Página {page} de {ultimaPagina}
                </span>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => onChangePage({ page: page - 1, pageSize })}
                  className="h-8 rounded-[9px] border border-line bg-card px-3 font-semibold disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={page >= ultimaPagina}
                  onClick={() => onChangePage({ page: page + 1, pageSize })}
                  className="h-8 rounded-[9px] border border-line bg-card px-3 font-semibold disabled:opacity-40"
                >
                  Próxima
                </button>
              </span>
            </div>
          }
        />
      </div>

      {aberta && (
        <div className="min-w-0 flex-[1_1_320px] lg:sticky lg:top-6">
          <DetailPanel
            key={aberta.id}
            transacao={aberta}
            onFechar={() => setAbertaId(undefined)}
            onExcluir={setDeleteTarget}
            onFormularioCompleto={(id) =>
              navigate(
                `${urlRouters.editTransactions.replace(":id", id)}${window.location.search}`,
              )
            }
          />
        </div>
      )}

      <FiltersSheet
        open={cadastroAberto}
        onOpenChange={setCadastroAberto}
        value={filtrosPainel}
        onApply={aplicarPainel}
        onClear={() => {
          setQ({ createdAtStart: "", createdAtEnd: "" });
          setCadastroAberto(false);
        }}
      />

      <DeleteTransactionDialog
        target={deleteTarget}
        isDeleting={excluindo}
        onClose={() => !excluindo && setDeleteTarget(null)}
        onConfirm={confirmarExclusao}
      />
    </div>
  );
};

export default Transactions;
