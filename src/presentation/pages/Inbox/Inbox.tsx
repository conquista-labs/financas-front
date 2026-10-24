import { CheckCheck, CopyX, EyeOff, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { LancamentoExterno } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";
import {
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui";
import {
  useGetCaixaEntrada,
  useGetCaixaEntradaResumo,
  useGetCategorias,
  useGetPessoas,
} from "@/presentation/hooks/api";

import { InboxKpis, InboxRow } from "./components";
import {
  categoriaDe,
  type InboxEdit,
  type InboxVisao,
  MOTIVOS_IGNORADO,
} from "./inbox.helpers";
import { useInboxMutations } from "./useInboxMutations";

const LIMIT = 50;
const OPT_LIMIT = { page: 1, limit: 100 };

type Filtro = "todos" | "dica" | `pessoa:${string}`;

/**
 * Caixa de entrada — o que a sincronização bancária trouxe e ainda não virou
 * transação. Revisar = confirmar/ajustar categoria e aceitar (em lote ou um a
 * um), ou ignorar. Os ignorados automaticamente (fatura, Pix entre vocês,
 * investimentos) ficam numa lista à parte, restauráveis. O que bate com uma
 * transação já lançada (mesmo valor, dia e meio) é ligado sozinho e aparece em
 * "Já lançados", de onde dá para desvincular.
 */
const Inbox = () => {
  const [visao, setVisao] = useState<InboxVisao>("pendente");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const [edits, setEdits] = useState<Record<string, InboxEdit>>({});
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());

  const params = {
    page,
    limit: LIMIT,
    status: visao,
    ...(filtro === "dica" && { comDica: true }),
    ...(filtro.startsWith("pessoa:") && { pessoaId: filtro.slice(7) }),
    ...(busca.trim() && { busca: busca.trim() }),
  };
  const lista = useGetCaixaEntrada(params);
  const resumo = useGetCaixaEntradaResumo();
  const categorias = useGetCategorias(OPT_LIMIT);
  const pessoas = useGetPessoas(OPT_LIMIT);
  const {
    aceitar,
    ignorar,
    ignorarParecidas,
    restaurar,
    desvincular,
    sincronizar,
  } = useInboxMutations();

  const rows = lista.data?.data?.rows ?? [];
  const meta = lista.data?.data?.meta;

  // Receita só aceita categoria de receita (o tipo da transação vem dela).
  const categoriasPorTipo = useMemo(() => {
    const todas = categorias.data?.data?.rows ?? [];
    const opts = (tipo: string): ComboboxOption[] =>
      todas
        .filter((c) => c.tipo === tipo)
        .map((c) => ({ value: c.id, label: c.nome }));
    return { receita: opts("receita"), despesa: opts("despesa") };
  }, [categorias.data]);

  const pessoasOpts = pessoas.data?.data?.rows ?? [];
  // Seletor de pessoa da revisão (inclui "Casal").
  const pessoaOptions = useMemo<ComboboxOption[]>(
    () =>
      (pessoas.data?.data?.rows ?? []).map((p) => ({
        value: p.id,
        label: p.nome,
      })),
    [pessoas.data],
  );

  const mudarFiltro = (f: Filtro) => {
    setFiltro(f);
    setPage(1);
    setSelecionados(new Set());
  };
  const mudarVisao = (v: typeof visao) => {
    setVisao(v);
    // "Com dica" só existe em pendentes; mantê-lo esvaziaria os ignorados.
    if (filtro === "dica") setFiltro("todos");
    setPage(1);
    setSelecionados(new Set());
  };

  const marcarOcupados = (ids: string[], on: boolean) =>
    setOcupados((prev) => {
      const s = new Set(prev);
      ids.forEach((id) => (on ? s.add(id) : s.delete(id)));
      return s;
    });

  const limparLocais = (ids: string[]) => {
    setSelecionados((prev) => {
      const s = new Set(prev);
      ids.forEach((id) => s.delete(id));
      return s;
    });
    setEdits((prev) => {
      const e = { ...prev };
      ids.forEach((id) => delete e[id]);
      return e;
    });
  };

  const handleAceitar = (alvo: LancamentoExterno[]) => {
    const semCategoria = alvo.filter((l) => !categoriaDe(l, edits[l.id]));
    const prontos = alvo.filter((l) => categoriaDe(l, edits[l.id]));
    if (!prontos.length) {
      toast.error("Escolha uma categoria antes de aceitar.");
      return;
    }
    const ids = prontos.map((l) => l.id);
    marcarOcupados(ids, true);
    aceitar.mutate(
      {
        itens: prontos.map((l) => ({
          id: l.id,
          categoriaId: categoriaDe(l, edits[l.id]),
          ...(edits[l.id]?.descricao?.trim() && {
            descricao: edits[l.id]!.descricao!.trim(),
          }),
          // Só manda quando foi trocada; sem isso a API usa o titular.
          ...(edits[l.id]?.pessoaId !== undefined && {
            pessoaId: edits[l.id]!.pessoaId,
          }),
        })),
      },
      {
        onSuccess: (r) => {
          const { aceitos, vinculados, erros } = r.data;
          const partes = [
            aceitos && `${aceitos} lançado${aceitos === 1 ? "" : "s"}`,
            vinculados &&
              `${vinculados} conta${vinculados === 1 ? "" : "s"} marcada${vinculados === 1 ? "" : "s"} como paga${vinculados === 1 ? "" : "s"}`,
          ].filter(Boolean);
          if (partes.length) toast.success(partes.join(" · "));
          if (erros.length) toast.error(erros[0].erro);
          if (semCategoria.length)
            toast.warning(
              `${semCategoria.length} ficaram sem categoria e não foram aceitos.`,
            );
          limparLocais(ids.filter((id) => !erros.some((e) => e.id === id)));
        },
        onError: () => toast.error("Não foi possível aceitar. Tente de novo."),
        onSettled: () => marcarOcupados(ids, false),
      },
    );
  };

  const handleIgnorar = (ids: string[], criarRegra = false) => {
    marcarOcupados(ids, true);
    ignorar.mutate(
      { ids, criarRegra },
      {
        onSuccess: (r) => {
          toast.success(
            criarRegra
              ? "Ignorado. Os próximos iguais também serão ignorados."
              : `${r.data.ignorados} ignorado${r.data.ignorados === 1 ? "" : "s"}`,
          );
          limparLocais(ids);
        },
        onError: () => toast.error("Não foi possível ignorar. Tente de novo."),
        onSettled: () => marcarOcupados(ids, false),
      },
    );
  };

  const handleRestaurar = (ids: string[]) => {
    marcarOcupados(ids, true);
    restaurar.mutate(ids, {
      onSuccess: () => toast.success("De volta à caixa de entrada"),
      onError: () => toast.error("Não foi possível restaurar."),
      onSettled: () => marcarOcupados(ids, false),
    });
  };

  const handleDesvincular = (ids: string[]) => {
    marcarOcupados(ids, true);
    desvincular.mutate(ids, {
      onSuccess: () =>
        toast.success("Desvinculado. Voltou para a caixa para vocês revisarem."),
      onError: () => toast.error("Não foi possível desvincular."),
      onSettled: () => marcarOcupados(ids, false),
    });
  };

  const handleIgnorarParecidas = () =>
    ignorarParecidas.mutate(undefined, {
      onSuccess: (r) => {
        const n = r.data.ignorados;
        toast.success(
          `${n} ignorada${n === 1 ? "" : "s"}. Dá para restaurar em Ignorados.`,
        );
        setSelecionados(new Set());
      },
      onError: () => toast.error("Não foi possível ignorar. Tente de novo."),
    });

  const handleSincronizar = () =>
    sincronizar.mutate(undefined, {
      onSuccess: (r) => {
        const { novos, erros, vinculadosJaLancados } = r.data.totais;
        if (erros) toast.error("Algum banco não respondeu. Veja as contas.");
        const partes = [
          novos &&
            `${novos} lançamento${novos === 1 ? "" : "s"} novo${novos === 1 ? "" : "s"}`,
          vinculadosJaLancados &&
            `${vinculadosJaLancados} já estava${vinculadosJaLancados === 1 ? "" : "m"} lançado${vinculadosJaLancados === 1 ? "" : "s"}`,
        ].filter(Boolean);
        toast.success(partes.length ? partes.join(" · ") : "Nada novo nos bancos");
      },
      onError: () => toast.error("Não foi possível sincronizar agora."),
    });

  const selecionadosRows = rows.filter((l) => selecionados.has(l.id));
  const todosMarcados =
    rows.length > 0 && rows.every((l) => selecionados.has(l.id));
  const toggleTodos = () =>
    setSelecionados(todosMarcados ? new Set() : new Set(rows.map((l) => l.id)));

  const filtros: { id: Filtro; label: string }[] = [
    { id: "todos", label: "Todos" },
    ...pessoasOpts.map((p) => ({
      id: `pessoa:${p.id}` as Filtro,
      label: p.nome,
    })),
    ...(visao === "pendente"
      ? [{ id: "dica" as Filtro, label: "Com dica" }]
      : []),
  ];

  return (
    // O provider do app só cobre a Sidebar; os tooltips das ações precisam do seu.
    <TooltipProvider delayDuration={200}>
    <div className="animate-om-fade">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
            Caixa de entrada
          </h1>
          <p className="mt-[6px] text-sm text-muted">
            O que chegou dos bancos. Confira a categoria e aceite, o resto a
            gente já separou.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSincronizar}
          disabled={sincronizar.isPending}
          className="flex items-center gap-[7px] rounded-[12px] border border-line bg-card px-[15px] py-[10px] text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          <RefreshCw
            className={cn("size-4", sincronizar.isPending && "animate-spin")}
            strokeWidth={2.2}
          />
          {sincronizar.isPending ? "Sincronizando…" : "Sincronizar agora"}
        </button>
      </div>

      <InboxKpis resumo={resumo.data?.data} isLoading={resumo.isLoading} />

      <div className="mt-5 rounded-[20px] border border-line bg-card px-5 pb-3 pt-4">
        {/* Visão + filtros + busca */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-[5px] rounded-[12px] bg-track p-1">
              {(
                [
                  { v: "pendente", label: "Para revisar" },
                  { v: "vinculado", label: "Já lançados" },
                  { v: "ignorado", label: "Ignorados" },
                ] as const
              ).map((t) => (
                <button
                  key={t.v}
                  type="button"
                  onClick={() => mudarVisao(t.v)}
                  className={cn(
                    "rounded-[9px] px-3 py-[7px] text-[12.5px] font-semibold transition-colors",
                    visao === t.v
                      ? "bg-card text-primary-strong shadow-[0_2px_6px_rgba(0,0,0,.08)]"
                      : "text-muted",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => mudarFiltro(f.id)}
                className={cn(
                  "rounded-full border px-3 py-[5px] text-[12.5px] font-semibold transition-colors",
                  filtro === f.id
                    ? "border-primary bg-primary/soft text-primary-strong"
                    : "border-line text-fg2 hover:border-primary/50",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-[10px] border border-line px-3 py-[7px] focus-within:border-primary">
            <Search className="size-4 text-muted" strokeWidth={2} />
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar descrição"
              aria-label="Buscar descrição"
              className="w-[180px] bg-transparent text-[13px] outline-none"
            />
          </label>
        </div>

        {/* Ações em lote */}
        {visao === "pendente" && rows.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-line2 py-[10px]">
            <button
              type="button"
              onClick={toggleTodos}
              className="text-[12.5px] font-semibold text-primary hover:underline"
            >
              {todosMarcados ? "Desmarcar todos" : "Marcar todos desta página"}
            </button>
            <span className="flex-1" />
            {!!resumo.data?.data?.possiveisDuplicadas && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    disabled={ignorarParecidas.isPending}
                    onClick={handleIgnorarParecidas}
                    className="flex items-center gap-[6px] rounded-[10px] border border-warning/40 px-3 py-[7px] text-[12.5px] font-semibold text-warning transition-colors hover:bg-warning/10 disabled:opacity-50"
                  >
                    <CopyX className="size-[15px]" strokeWidth={2} />
                    Ignorar {resumo.data.data.possiveisDuplicadas} que parece
                    {resumo.data.data.possiveisDuplicadas === 1 ? "" : "m"} já
                    lançada
                    {resumo.data.data.possiveisDuplicadas === 1 ? "" : "s"}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Têm o mesmo valor e dia de uma transação que já existe. Dá para
                  restaurar em Ignorados.
                </TooltipContent>
              </Tooltip>
            )}
            {selecionadosRows.length > 0 && (
              <Combobox
                options={pessoaOptions}
                value=""
                onChange={(v) =>
                  setEdits((prev) => {
                    const e = { ...prev };
                    selecionadosRows.forEach((l) => {
                      e[l.id] = { ...e[l.id], pessoaId: v };
                    });
                    return e;
                  })
                }
                placeholder="Pessoa dos selecionados"
                clearLabel="Ninguém"
                searchPlaceholder="Buscar pessoa…"
                className="!w-[190px] !rounded-[10px] !border-line !px-3 !py-[7px] !text-[12.5px]"
                contentClassName="min-w-[200px]"
              />
            )}
            <button
              type="button"
              disabled={!selecionadosRows.length || ignorar.isPending}
              onClick={() => handleIgnorar(selecionadosRows.map((l) => l.id))}
              className="flex items-center gap-[6px] rounded-[10px] border border-line px-3 py-[7px] text-[12.5px] font-semibold text-fg2 transition-colors hover:bg-track disabled:opacity-50"
            >
              <EyeOff className="size-[15px]" strokeWidth={2} />
              Ignorar selecionados
            </button>
            <button
              type="button"
              disabled={!selecionadosRows.length || aceitar.isPending}
              onClick={() => handleAceitar(selecionadosRows)}
              className="flex items-center gap-[6px] rounded-[10px] bg-primary px-3 py-[7px] text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-strong disabled:opacity-50"
            >
              <CheckCheck className="size-[15px]" strokeWidth={2.2} />
              Aceitar selecionados ({selecionadosRows.length})
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="[&>*:last-child]:border-0">
          {lista.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="my-2 h-[46px] rounded-[10px]" />
            ))
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-[13.5px] text-muted">
              {visao === "pendente"
                ? busca || filtro !== "todos"
                  ? "Nada para revisar com esse filtro."
                  : "Tudo revisado. Quando os bancos trouxerem algo novo, aparece aqui."
                : visao === "vinculado"
                  ? "Nada ligado a lançamentos que já existiam."
                  : "Nada ignorado com esse filtro."}
            </p>
          ) : (
            rows.map((l) => (
              <InboxRow
                key={l.id}
                lancamento={l}
                modo={visao}
                edit={edits[l.id]}
                categorias={categoriasPorTipo[l.tipo]}
                pessoas={pessoaOptions}
                selecionado={selecionados.has(l.id)}
                ocupado={ocupados.has(l.id)}
                onToggle={() =>
                  setSelecionados((prev) => {
                    const s = new Set(prev);
                    if (s.has(l.id)) s.delete(l.id);
                    else s.add(l.id);
                    return s;
                  })
                }
                onChange={(patch) =>
                  setEdits((prev) => ({
                    ...prev,
                    [l.id]: { ...prev[l.id], ...patch },
                  }))
                }
                onAceitar={() => handleAceitar([l])}
                onIgnorar={() => handleIgnorar([l.id])}
                onRestaurar={() => handleRestaurar([l.id])}
                onDesvincular={() => handleDesvincular([l.id])}
              />
            ))
          )}
        </div>

        {/* Paginação */}
        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-line2 pt-3 text-[12.5px] text-muted">
            <span>
              {meta.total.toLocaleString("pt-BR")} lançamentos · página{" "}
              {meta.page} de {meta.lastPage}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-[9px] border border-line px-3 py-[6px] font-semibold text-fg2 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= meta.lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-[9px] border border-line px-3 py-[6px] font-semibold text-fg2 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumo dos ignorados automaticamente */}
      {visao === "pendente" && !!resumo.data?.data?.ignorados && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[16px] bg-track px-5 py-3 text-[12.5px] text-fg2">
          <span className="font-semibold text-fg">Ignorados automaticamente</span>
          {resumo.data.data.ignoradosPorMotivo
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((m) => (
              <span key={m.motivo}>
                {MOTIVOS_IGNORADO[m.motivo] ?? m.motivo} {m.total}
              </span>
            ))}
          <button
            type="button"
            onClick={() => mudarVisao("ignorado")}
            className="font-semibold text-primary hover:underline"
          >
            Ver e restaurar
          </button>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
};

export default Inbox;
