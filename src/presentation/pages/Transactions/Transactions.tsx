import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
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
import { useQuickAdd } from "@/presentation/components/QuickAdd";
import {
  useDeleteTransacoesId,
  useGetRelatorioTransacoes,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { useDebounce, usePagination } from "@/presentation/hooks/core";
import { urlRouters } from "@/presentation/router/router.definitions";

import { ActionBar } from "./components/ActionBar";
import { ActiveFilterChips } from "./components/ActiveFilterChips";
import type { TransactionFilters } from "./components/FiltersSheet";
import { FiltersSheet } from "./components/FiltersSheet";
import { MonthSelector } from "./components/MonthSelector";
import { TransactionsList } from "./components/TransactionsList";

/**
 * Tela de Transações (nova identidade "Nossa Grana"). Fatia 1: lista + busca +
 * paginação + export. Fatia 2: filtros avançados (painel + chips ativos).
 * Preserva a lógica de dados da versão anterior (query params na URL, hooks
 * React Query); só a apresentação muda. Lançamento rápido vem depois.
 */
const Transactions = () => {
  const navigate = useNavigate();
  const { openQuickAdd } = useQuickAdd();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [queryParams, setQueryParams] = useQueryParams({
    startDate: withDefault(DateParam, startOfMonth(new Date())),
    endDate: DateParam,
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
    search: withDefault(StringParam, ""),
    tipo: withDefault(StringParam, ""),
  });

  const { page, pageSize, onChangePage, onChangePageSize } = usePagination();

  // Busca com debounce: input local reflete imediato, query dispara após 300ms.
  const [searchInput, setSearchInput] = useState(queryParams.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== queryParams.search) {
      setQueryParams({ search: debouncedSearch });
      onChangePage({ page: 1, pageSize });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const formattedParams = useMemo(
    () => ({
      ...queryParams,
      startDate: format(queryParams.startDate, "yyyy-MM-dd"),
      endDate: queryParams.endDate
        ? format(queryParams.endDate, "yyyy-MM-dd")
        : "",
    }),
    [queryParams],
  );

  const { data, isLoading } = useGetTransacoes({
    page,
    limit: pageSize,
    ...formattedParams,
  });

  const { refetch: fetchRelatorio, isFetching: isExporting } =
    useGetRelatorioTransacoes(
      { page, limit: pageSize, ...formattedParams },
      { enabled: false },
    );

  const { mutate: deleteTransacao } = useDeleteTransacoesId();

  const rows = data?.data?.rows ?? [];
  const totalItems = data?.data?.meta?.total ?? 0;
  const periodTotal = data?.data?.resume?.total ?? 0;

  const activeFilterCount = [
    queryParams.categoriaId,
    queryParams.pessoaId,
    queryParams.meioPagamentoId,
    queryParams.formaPagamento,
    queryParams.tipo,
  ].filter(Boolean).length;

  // Filtros (subconjunto dos query params) para o painel e os chips ativos.
  const filters: TransactionFilters = {
    tipo: queryParams.tipo,
    categoriaId: queryParams.categoriaId,
    pessoaId: queryParams.pessoaId,
    meioPagamentoId: queryParams.meioPagamentoId,
    formaPagamento: queryParams.formaPagamento,
    startDate: formattedParams.startDate,
    endDate: formattedParams.endDate,
  };

  const applyFilters = (next: TransactionFilters) => {
    setQueryParams({
      tipo: next.tipo,
      categoriaId: next.categoriaId,
      pessoaId: next.pessoaId,
      meioPagamentoId: next.meioPagamentoId,
      formaPagamento: next.formaPagamento,
      startDate: next.startDate
        ? new Date(`${next.startDate}T00:00:00`)
        : undefined,
      endDate: next.endDate ? new Date(`${next.endDate}T00:00:00`) : undefined,
    });
    onChangePage({ page: 1, pageSize });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setQueryParams({
      tipo: "",
      categoriaId: "",
      pessoaId: "",
      meioPagamentoId: "",
      formaPagamento: "",
    });
    onChangePage({ page: 1, pageSize });
    setFiltersOpen(false);
  };

  const removeFilter = (key: keyof TransactionFilters) => {
    setQueryParams({ [key]: "" });
    onChangePage({ page: 1, pageSize });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const multiplier = direction === "prev" ? -1 : 1;
    const newStart = addMonths(queryParams.startDate, multiplier);
    const newEnd = endOfMonth(newStart);
    setQueryParams({ startDate: newStart, endDate: newEnd });
    onChangePage({ page: 1, pageSize });
  };

  const handleExport = async () => {
    try {
      const { data: report } = await fetchRelatorio();
      const blob = new Blob([report as unknown as BlobPart], {
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

  const handleDelete = (transacao: TransacaoResponse) => {
    deleteTransacao(
      { id: transacao.id },
      {
        onSuccess: () =>
          toast.success("Transação excluída", {
            action: {
              label: "Desfazer",
              // TODO: re-POST do payload (não há endpoint de restore) — Fatia 2.
              onClick: () => toast.info("Desfazer virá com o lançamento."),
            },
          }),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleDuplicate = () =>
    toast.info("Duplicar chega com o lançamento rápido (Fatia 2).");

  const goToEdit = (id: string) =>
    navigate(
      `${urlRouters.editTransactions.replace(":id", id)}${window.location.search}`,
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Header: título + seletor de mês */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
          Transações
        </h1>
        <MonthSelector
          date={queryParams.startDate}
          onPrev={() => navigateMonth("prev")}
          onNext={() => navigateMonth("next")}
        />
      </div>

      <ActionBar
        search={searchInput}
        onSearchChange={setSearchInput}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
        onNew={openQuickAdd}
      />

      <ActiveFilterChips
        filters={filters}
        onRemove={removeFilter}
        onClearAll={clearFilters}
      />

      <TransactionsList
        rows={rows}
        total={periodTotal}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        isExporting={isExporting}
        onEdit={goToEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onChangePage={(p) => onChangePage({ page: p, pageSize })}
        onChangePageSize={(size) => onChangePageSize(size)}
        onExport={handleExport}
      />

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
};

export default Transactions;
