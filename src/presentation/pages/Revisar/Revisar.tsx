import { CopyX, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import {
  useConfirmarImportacao,
  useGetCaixaEntrada,
  useGetCaixaEntradaResumo,
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";
import {
  type LinhaExtrato,
  useFilaExtrato,
} from "@/presentation/store/filaExtrato";

import { FilaItem } from "./components/FilaItem";
import { PainelItem, type PainelOpcoes } from "./components/PainelItem";
import { toConfirmacao } from "./extrato/extrato.helpers";
import { ImportarExtrato } from "./extrato/ImportarExtrato";
import {
  type Fonte,
  type ItemFila,
  montarFila,
  proximoId,
} from "./revisar.fila";
import {
  categoriaDe,
  type InboxEdit,
  type InboxVisao,
  MOTIVOS_IGNORADO,
} from "./revisar.helpers";
import { useRevisarMutations } from "./useRevisarMutations";

const LIMIT = 50;
const OPT_LIMIT = { page: 1, limit: 100 };
const plural = (n: number, s: string, p = `${s}s`) => `${n} ${n === 1 ? s : p}`;

/** Atalho de teclado não vale enquanto se digita ou com um modal aberto. */
const ignorarTecla = (ev: KeyboardEvent) => {
  const el = ev.target as HTMLElement | null;
  return (
    ev.metaKey ||
    ev.ctrlKey ||
    ev.altKey ||
    !!el?.closest(
      "input, textarea, select, [contenteditable=true], [role=listbox], [role=dialog]",
    ) ||
    !!document.querySelector("[role=dialog]")
  );
};

/**
 * Revisar — uma fila só com o que chegou do banco (sincronização) e do
 * extrato importado (fica no navegador até virar transação). À esquerda a
 * fila; à direita o item aberto, com categoria/pessoa/meio já sugeridos e as
 * ações: Aceitar (A), Ignorar (I), Já lancei (J). ↑↓ navega.
 */
const Revisar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visao, setVisao] = useState<InboxVisao>("pendente");
  const [fonte, setFonte] = useState<Fonte>("tudo");
  const [busca, setBusca] = useState("");
  const [pessoaFiltro, setPessoaFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [edits, setEdits] = useState<Record<string, InboxEdit>>({});
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [atualId, setAtualId] = useState<string>();
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const importAberto = searchParams.get("importar") === "1";
  const listaRef = useRef<HTMLDivElement>(null);

  const setImportAberto = (aberto: boolean) =>
    setSearchParams(
      (p) => {
        if (aberto) p.set("importar", "1");
        else p.delete("importar");
        return p;
      },
      { replace: true },
    );

  // ── Dados ──────────────────────────────────────────────────────────────
  const lista = useGetCaixaEntrada({
    page,
    limit: LIMIT,
    status: visao,
    ...(fonte === "dica" && { comDica: true }),
    ...(pessoaFiltro && { pessoaId: pessoaFiltro }),
    ...(busca.trim() && { busca: busca.trim() }),
  });
  const resumo = useGetCaixaEntradaResumo();
  const categorias = useGetCategorias(OPT_LIMIT);
  const pessoas = useGetPessoas(OPT_LIMIT);
  const meios = useGetMeiosPagamento(OPT_LIMIT);
  const enums = useGetEnums();
  const m = useRevisarMutations();
  const confirmar = useConfirmarImportacao();
  const extrato = useFilaExtrato();

  const rowsBanco = useMemo(() => lista.data?.data?.rows ?? [], [lista.data]);
  const meta = lista.data?.data?.meta;
  const r = resumo.data?.data;

  const fila = useMemo(
    () =>
      montarFila({
        banco: rowsBanco,
        extrato: extrato.linhas,
        visao,
        fonte,
        busca,
        pessoaId: pessoaFiltro,
      }),
    [rowsBanco, extrato.linhas, visao, fonte, busca, pessoaFiltro],
  );
  const atual = fila.find((x) => x.id === atualId) ?? fila[0];
  const posicao = atual ? fila.indexOf(atual) + 1 : 0;

  // ── Opções ─────────────────────────────────────────────────────────────
  const opcoes = useMemo<PainelOpcoes>(() => {
    const cats = categorias.data?.data?.rows ?? [];
    const porTipo = (t: string): ComboboxOption[] =>
      cats
        .filter((c) => c.tipo === t)
        .map((c) => ({ value: c.id, label: c.nome }));
    return {
      categorias: { receita: porTipo("receita"), despesa: porTipo("despesa") },
      pessoas: (pessoas.data?.data?.rows ?? []).map((p) => ({
        value: p.id,
        label: p.nome,
      })),
      meios: (meios.data?.data?.rows ?? []).map((x) => ({
        value: x.id,
        label: x.nome,
      })),
      formas: (enums.data?.data?.formaPagamento ?? []).map((f) => ({
        value: f.value ?? "",
        label: f.label ?? "",
      })),
    };
  }, [categorias.data, pessoas.data, meios.data, enums.data]);
  const nomeCategoria = useMemo(
    () =>
      new Map((categorias.data?.data?.rows ?? []).map((c) => [c.id, c.nome])),
    [categorias.data],
  );

  const categoriaDoItem = (item: ItemFila) => {
    if (item.origem === "banco") {
      const id = categoriaDe(item.banco, edits[item.id]);
      if (!id) return undefined;
      const sugerida = !edits[item.id]?.categoriaId;
      return {
        nome: nomeCategoria.get(id) ?? item.banco.categoriaSugerida?.nome ?? "",
        sugerida,
      };
    }
    const id = item.extrato.categoriaId;
    return id
      ? { nome: nomeCategoria.get(id) ?? "", sugerida: false }
      : undefined;
  };

  // ── Contadores ─────────────────────────────────────────────────────────
  const ext = extrato.linhas;
  const extPend = ext.filter((l) => l.status === "pendente");
  const extIgn = ext.filter((l) => l.status === "ignorado").length;
  const extDup = extPend.filter((l) => l.possivelDuplicada);
  const visoes: { v: InboxVisao; t: string; n?: number }[] = [
    {
      v: "pendente",
      t: "Para revisar",
      n: (r?.pendentes ?? 0) + extPend.length,
    },
    {
      v: "vinculado",
      t: "Já lançados",
      n: r ? r.vinculadosAutomaticamente + r.vinculadosManualmente : undefined,
    },
    { v: "ignorado", t: "Ignorados", n: (r?.ignorados ?? 0) + extIgn },
  ];
  const fontes: { f: Fonte; t: string; n?: number }[] =
    visao === "pendente"
      ? [
          { f: "tudo", t: "Tudo", n: (r?.pendentes ?? 0) + extPend.length },
          { f: "bancos", t: "Bancos", n: r?.pendentes },
          { f: "extrato", t: "Extrato", n: extPend.length },
          { f: "dica", t: "Com dica", n: (r?.comDica ?? 0) + extDup.length },
        ]
      : visao === "ignorado"
        ? [
            { f: "tudo", t: "Tudo" },
            { f: "bancos", t: "Bancos" },
            { f: "extrato", t: "Extrato", n: extIgn },
          ]
        : [];

  // ── Estado local ───────────────────────────────────────────────────────
  const marcarOcupados = (ids: string[], on: boolean) =>
    setOcupados((prev) => {
      const s = new Set(prev);
      ids.forEach((id) => (on ? s.add(id) : s.delete(id)));
      return s;
    });
  const sair = useCallback(
    (ids: string[]) => {
      setAtualId((cur) => proximoId(fila, cur ?? fila[0]?.id, ids));
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
    },
    [fila],
  );
  const separar = (itens: ItemFila[]) => ({
    banco: itens.flatMap((x) => (x.origem === "banco" ? [x.banco] : [])),
    ext: itens.flatMap((x) => (x.origem === "extrato" ? [x.extrato] : [])),
  });

  const trocarVisao = (v: InboxVisao) => {
    setVisao(v);
    if (fonte === "dica" || v === "vinculado") setFonte("tudo");
    setPage(1);
    setSelecionados(new Set());
    setAtualId(undefined);
    setConfirmandoLimpar(false);
  };

  // ── Ações ──────────────────────────────────────────────────────────────
  const aceitar = async (itens: ItemFila[]) => {
    const { banco, ext } = separar(itens);
    const semCategoria =
      banco.filter((l) => !categoriaDe(l, edits[l.id])).length +
      ext.filter((l) => !l.categoriaId).length;
    const bancoProntos = banco.filter((l) => categoriaDe(l, edits[l.id]));
    const extProntos = ext.filter((l) => l.categoriaId);
    if (!bancoProntos.length && !extProntos.length) {
      toast.error("Escolha uma categoria antes de aceitar.");
      return;
    }
    const ids = [
      ...bancoProntos.map((l) => l.id),
      ...extProntos.map((l) => l.id),
    ];
    marcarOcupados(ids, true);
    const ok: string[] = [];
    const partes: string[] = [];
    try {
      if (bancoProntos.length) {
        const res = await m.aceitar.mutateAsync({
          itens: bancoProntos.map((l) => {
            const e = edits[l.id];
            return {
              id: l.id,
              categoriaId: categoriaDe(l, e),
              ...(e?.descricao?.trim() && { descricao: e.descricao.trim() }),
              ...(e?.pessoaId !== undefined && { pessoaId: e.pessoaId }),
              ...(e?.meioPagamentoId !== undefined && {
                meioPagamentoId: e.meioPagamentoId,
              }),
              ...(e?.criarFuturas && { criarFuturas: true }),
            };
          }),
        });
        const { aceitos, vinculados, erros, futurasCriadas = 0 } = res.data;
        if (aceitos) partes.push(plural(aceitos, "lançado"));
        if (vinculados)
          partes.push(
            `${plural(vinculados, "marcado")} como pago${vinculados === 1 ? "" : "s"}`,
          );
        if (futurasCriadas)
          partes.push(
            plural(futurasCriadas, "parcela futura", "parcelas futuras"),
          );
        if (erros.length) toast.error(erros[0].erro);
        ok.push(
          ...bancoProntos
            .map((l) => l.id)
            .filter((id) => !erros.some((e) => e.id === id)),
        );
      }
      if (extProntos.length) {
        // Uma chamada por tag (a API aplica uma tag em lote por confirmação).
        const porTag = new Map<string, LinhaExtrato[]>();
        extProntos.forEach((l) =>
          porTag.set(l.tag ?? "", [...(porTag.get(l.tag ?? "") ?? []), l]),
        );
        for (const [tag, linhas] of porTag) {
          await confirmar.mutateAsync({
            linhas: linhas.map(toConfirmacao),
            ...(tag ? { tagEmLote: tag } : {}),
          });
          extrato.remover(linhas.map((l) => l.id));
          ok.push(...linhas.map((l) => l.id));
        }
        partes.push(
          plural(
            extProntos.length,
            "lançado do extrato",
            "lançados do extrato",
          ),
        );
      }
      if (partes.length) toast.success(partes.join(" · "));
      if (semCategoria)
        toast.warning(
          `${plural(semCategoria, "ficou", "ficaram")} sem categoria e não ${semCategoria === 1 ? "foi aceito" : "foram aceitos"}.`,
        );
      sair(ok);
    } catch {
      toast.error("Não foi possível aceitar. Tente de novo.");
    } finally {
      marcarOcupados(ids, false);
    }
  };

  const ignorar = (itens: ItemFila[]) => {
    const { banco, ext } = separar(itens);
    if (ext.length) extrato.ignorar(ext.map((l) => l.id));
    const ids = banco.map((l) => l.id);
    if (!ids.length) {
      toast.success(
        `${plural(ext.length, "ignorado")}. Dá para restaurar em Ignorados.`,
      );
      return sair(ext.map((l) => l.id));
    }
    marcarOcupados(ids, true);
    m.ignorar.mutate(
      { ids, criarRegra: false },
      {
        onSuccess: (res) => {
          toast.success(
            `${plural(res.data.ignorados + ext.length, "ignorado")}. Dá para restaurar em Ignorados.`,
          );
          sair([...ids, ...ext.map((l) => l.id)]);
        },
        onError: () => toast.error("Não foi possível ignorar. Tente de novo."),
        onSettled: () => marcarOcupados(ids, false),
      },
    );
  };

  const jaLancei = (itens: ItemFila[], transacaoId?: string) => {
    const { banco, ext } = separar(itens);
    if (ext.length) {
      extrato.remover(ext.map((l) => l.id));
      if (!banco.length) {
        toast.success(`${plural(ext.length, "tirado")} da fila.`);
        return sair(ext.map((l) => l.id));
      }
    }
    const ids = banco.map((l) => l.id);
    marcarOcupados(ids, true);
    m.vincular.mutate(
      {
        itens: banco.map((l) => ({
          id: l.id,
          ...(transacaoId && { transacaoId }),
        })),
      },
      {
        onSuccess: (res) => {
          const { vinculados, marcadasPagas, erros } = res.data;
          if (vinculados)
            toast.success(
              `${plural(vinculados, "ligado")} ao que já estava lançado` +
                (marcadasPagas
                  ? ` · ${plural(marcadasPagas, "marcada")} como paga${marcadasPagas === 1 ? "" : "s"}`
                  : ""),
            );
          if (erros.length)
            toast.warning(
              erros.length === 1
                ? erros[0].erro
                : `${erros.length} sem transação para ligar (ficaram na fila).`,
            );
          sair([
            ...ids.filter((id) => !erros.some((e) => e.id === id)),
            ...ext.map((l) => l.id),
          ]);
        },
        onError: () => toast.error("Não foi possível ligar. Tente de novo."),
        onSettled: () => marcarOcupados(ids, false),
      },
    );
  };

  const excluir = (itens: ItemFila[]) => {
    const { banco, ext } = separar(itens);
    if (ext.length) extrato.remover(ext.map((l) => l.id));
    const ids = banco.map((l) => l.id);
    if (!ids.length) {
      toast.success(`${plural(ext.length, "excluído")} da fila.`);
      return sair(ext.map((l) => l.id));
    }
    marcarOcupados(ids, true);
    m.excluir.mutate(ids, {
      onSuccess: (res) => {
        toast.success(
          `${plural(res.data.excluidos + ext.length, "excluído")}. Não volta na sincronização.`,
        );
        sair([...ids, ...ext.map((l) => l.id)]);
      },
      onError: () => toast.error("Não foi possível excluir. Tente de novo."),
      onSettled: () => marcarOcupados(ids, false),
    });
  };

  const restaurar = (itens: ItemFila[]) => {
    const { banco, ext } = separar(itens);
    if (ext.length) extrato.restaurar(ext.map((l) => l.id));
    const ids = banco.map((l) => l.id);
    const fim = () => {
      toast.success("De volta à fila para revisar");
      sair(itens.map((x) => x.id));
    };
    if (!ids.length) return fim();
    marcarOcupados(ids, true);
    m.restaurar.mutate(ids, {
      onSuccess: fim,
      onError: () => toast.error("Não foi possível restaurar."),
      onSettled: () => marcarOcupados(ids, false),
    });
  };

  const desvincular = (item: ItemFila) => {
    if (item.origem !== "banco") return;
    marcarOcupados([item.id], true);
    m.desvincular.mutate([item.id], {
      onSuccess: () => {
        toast.success("Desvinculado. Voltou para a fila para revisar.");
        sair([item.id]);
      },
      onError: () => toast.error("Não foi possível desvincular."),
      onSettled: () => marcarOcupados([item.id], false),
    });
  };

  const ignorarParecidas = async () => {
    const ids = extDup.map((l) => l.id);
    if (ids.length) extrato.ignorar(ids);
    let n = ids.length;
    if (r?.possiveisDuplicadas) {
      try {
        const res = await m.ignorarParecidas.mutateAsync();
        n += res.data.ignorados;
      } catch {
        toast.error("Não foi possível ignorar as do banco. Tente de novo.");
      }
    }
    toast.success(`${plural(n, "ignorada")}. Dá para restaurar em Ignorados.`);
    setSelecionados(new Set());
  };

  const limparIgnorados = () => {
    if (!confirmandoLimpar) return setConfirmandoLimpar(true);
    const locais = extrato.limparIgnorados();
    m.limparIgnorados.mutate(undefined, {
      onSuccess: (res) => {
        const n = res.data.excluidos + locais;
        toast.success(
          n
            ? `${plural(n, "excluído")} de Ignorados.`
            : "Ignorados já estava vazio.",
        );
        setAtualId(undefined);
      },
      onError: () => toast.error("Não foi possível limpar. Tente de novo."),
      onSettled: () => setConfirmandoLimpar(false),
    });
  };

  const sincronizar = () =>
    m.sincronizar.mutate(undefined, {
      onSuccess: (res) => {
        const { novos, erros, vinculadosJaLancados } = res.data.totais;
        if (erros) toast.error("Algum banco não respondeu. Veja as contas.");
        const partes = [
          novos && plural(novos, "lançamento novo", "lançamentos novos"),
          vinculadosJaLancados &&
            `${vinculadosJaLancados} já estava${vinculadosJaLancados === 1 ? "" : "m"} lançado${vinculadosJaLancados === 1 ? "" : "s"}`,
        ].filter(Boolean);
        toast.success(
          partes.length ? partes.join(" · ") : "Nada novo nos bancos",
        );
      },
      onError: () => toast.error("Não foi possível sincronizar agora."),
    });

  // ── Teclado ────────────────────────────────────────────────────────────
  const navegar = useCallback(
    (passo: number) => {
      if (!fila.length) return;
      const i = Math.max(
        0,
        fila.findIndex((x) => x.id === atual?.id),
      );
      const prox = fila[Math.min(fila.length - 1, Math.max(0, i + passo))];
      setAtualId(prox.id);
      listaRef.current
        ?.querySelector(`[data-item="${prox.id}"]`)
        ?.scrollIntoView({ block: "nearest" });
    },
    [fila, atual?.id],
  );

  const acoesRef = useRef({
    aceitar,
    ignorar,
    jaLancei,
    navegar,
    atual,
    visao,
  });
  acoesRef.current = { aceitar, ignorar, jaLancei, navegar, atual, visao };
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ignorarTecla(ev)) return;
      const a = acoesRef.current;
      if (ev.key === "ArrowDown") return (ev.preventDefault(), a.navegar(1));
      if (ev.key === "ArrowUp") return (ev.preventDefault(), a.navegar(-1));
      if (!a.atual || a.visao !== "pendente" || ocupados.has(a.atual.id))
        return;
      const k = ev.key.toLowerCase();
      if (k === "a") a.aceitar([a.atual]);
      else if (k === "i") a.ignorar([a.atual]);
      else if (k === "j") a.jaLancei([a.atual]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ocupados]);

  // ── Seleção ────────────────────────────────────────────────────────────
  const selecionadosItens = fila.filter((x) => selecionados.has(x.id));
  const todosMarcados =
    fila.length > 0 && fila.every((x) => selecionados.has(x.id));
  const toggle = (id: string) =>
    setSelecionados((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  /** Aplica um campo a todos os selecionados (banco: edição local; extrato: fila). */
  const emLote = (
    patch: Pick<InboxEdit, "pessoaId" | "categoriaId" | "meioPagamentoId">,
  ) => {
    const { ext } = separar(selecionadosItens);
    if (ext.length)
      extrato.atualizarVarias(
        ext.map((l) => l.id),
        patch,
      );
    setEdits((prev) => {
      const e = { ...prev };
      selecionadosItens
        .filter((x) => x.origem === "banco")
        .forEach((x) => (e[x.id] = { ...e[x.id], ...patch }));
      return e;
    });
  };
  // Categoria em lote só quando todos os selecionados são do mesmo tipo.
  const tiposSelecionados = new Set(
    selecionadosItens.map((x) =>
      x.origem === "banco" ? x.banco.tipo : x.extrato.tipo,
    ),
  );
  const tipoEmLote =
    tiposSelecionados.size === 1
      ? ([...tiposSelecionados][0] as "receita" | "despesa")
      : undefined;

  const carregando = lista.isLoading && fonte !== "extrato";
  const possiveisDup = (r?.possiveisDuplicadas ?? 0) + extDup.length;

  return (
    <div className="flex animate-om-fade flex-col gap-4">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] font-bold -tracking-[0.03em] text-fg">
            Revisar
          </h1>
          <p className="mt-1 text-sm text-fg2">
            Tudo que chegou do banco ou do extrato, numa fila só. Confira e
            aceite — o resto a gente já separou.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={sincronizar}
            disabled={m.sincronizar.isPending}
            className="flex h-[42px] items-center gap-2 rounded-full border border-line bg-card px-[14px] text-sm font-semibold transition-colors hover:border-primary disabled:opacity-60"
          >
            <RefreshCw
              className={cn(
                "size-4",
                m.sincronizar.isPending && "animate-spin",
              )}
            />
            {m.sincronizar.isPending ? "Sincronizando…" : "Sincronizar bancos"}
          </button>
          <button
            type="button"
            onClick={() => setImportAberto(!importAberto)}
            className="flex h-[42px] items-center gap-2 rounded-full bg-fg px-4 text-sm font-semibold text-card transition-opacity hover:opacity-90"
          >
            <Upload className="size-4" /> Importar extrato
          </button>
        </div>
      </header>

      {importAberto && (
        <ImportarExtrato
          onFechar={() => setImportAberto(false)}
          onImportado={() => {
            setImportAberto(false);
            trocarVisao("pendente");
            setFonte("extrato");
          }}
        />
      )}

      {/* Visões + fontes + filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" className="flex gap-1 rounded-full bg-track p-1">
          {visoes.map((v) => (
            <button
              key={v.v}
              type="button"
              role="tab"
              aria-selected={visao === v.v}
              onClick={() => trocarVisao(v.v)}
              className={cn(
                "h-9 rounded-full px-[14px] text-[13px] font-semibold transition-colors",
                visao === v.v
                  ? "bg-card text-fg shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                  : "text-fg2 hover:text-fg",
              )}
            >
              {v.t}
              {v.n !== undefined && (
                <span className="ml-1 opacity-60">{v.n}</span>
              )}
            </button>
          ))}
        </div>
        {fontes.length > 0 && <span className="mx-1 h-6 w-px bg-line" />}
        {fontes.map((f) => (
          <button
            key={f.f}
            type="button"
            onClick={() => {
              setFonte(f.f);
              setPage(1);
              setSelecionados(new Set());
              setAtualId(undefined);
            }}
            className={cn(
              "h-9 rounded-full border px-[14px] text-[13px] font-semibold transition-colors",
              fonte === f.f
                ? "border-primary bg-primary-soft text-primary-strong dark:text-[#B3A9FF]"
                : "border-line bg-card text-fg2 hover:border-primary/40",
            )}
          >
            {f.t}
            {f.n !== undefined && (
              <span className="ml-1 opacity-60">{f.n}</span>
            )}
          </button>
        ))}
        <span className="flex-1" />
        <Combobox
          options={opcoes.pessoas}
          value={pessoaFiltro || undefined}
          onChange={(v) => {
            setPessoaFiltro(v);
            setPage(1);
            setAtualId(undefined);
          }}
          placeholder="Todas as pessoas"
          clearLabel="Todas as pessoas"
          searchPlaceholder="Buscar pessoa…"
          className="!h-9 !w-[170px] !rounded-full !text-[13px]"
        />
        <label className="flex h-9 items-center gap-2 rounded-full border border-line bg-card px-3 focus-within:border-primary">
          <Search className="size-4 text-muted" />
          <input
            value={busca}
            onChange={(ev) => {
              setBusca(ev.target.value);
              setPage(1);
              setAtualId(undefined);
            }}
            placeholder="Buscar descrição"
            aria-label="Buscar descrição"
            className="w-[150px] bg-transparent text-[13px] outline-none placeholder:text-muted"
          />
        </label>
      </div>

      {/* Fila + item */}
      <div className="flex flex-wrap items-start gap-4">
        <section
          aria-label="Fila"
          className="min-w-0 flex-[1_1_380px] overflow-hidden rounded-[22px] border border-line bg-card"
        >
          {/* Barra da fila: contagem ou ações em lote */}
          <div className="flex min-h-[50px] flex-wrap items-center gap-2 border-b border-line2 px-[14px] py-2 text-[12.5px]">
            {visao === "pendente" && fila.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setSelecionados(
                    todosMarcados ? new Set() : new Set(fila.map((x) => x.id)),
                  )
                }
                className="font-semibold text-primary hover:underline dark:text-[#B3A9FF]"
              >
                {todosMarcados ? "Desmarcar" : "Marcar todos"}
              </button>
            )}
            {selecionadosItens.length > 0 ? (
              <>
                <span className="font-semibold text-fg2">
                  {plural(selecionadosItens.length, "selecionado")}
                </span>
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => aceitar(selecionadosItens)}
                  className="h-[30px] rounded-full bg-primary px-3 font-bold text-white"
                >
                  Aceitar ({selecionadosItens.length})
                </button>
                <div className="flex w-full flex-wrap items-center gap-2 pt-1">
                  {tipoEmLote && (
                    <Combobox
                      options={opcoes.categorias[tipoEmLote]}
                      value=""
                      onChange={(v) => emLote({ categoriaId: v })}
                      placeholder="Categoria…"
                      searchPlaceholder="Buscar categoria…"
                      className="!h-[30px] !w-[130px] !rounded-full !text-[12.5px]"
                      contentClassName="min-w-[220px]"
                    />
                  )}
                  <Combobox
                    options={opcoes.meios}
                    value=""
                    onChange={(v) => emLote({ meioPagamentoId: v })}
                    placeholder="Meio…"
                    searchPlaceholder="Buscar meio…"
                    className="!h-[30px] !w-[110px] !rounded-full !text-[12.5px]"
                    contentClassName="min-w-[220px]"
                  />
                  <Combobox
                    options={opcoes.pessoas}
                    value=""
                    onChange={(v) => emLote({ pessoaId: v })}
                    placeholder="Pessoa…"
                    searchPlaceholder="Buscar pessoa…"
                    className="!h-[30px] !w-[110px] !rounded-full !text-[12.5px]"
                    contentClassName="min-w-[200px]"
                  />
                  <span className="flex-1" />
                  <button
                    type="button"
                    onClick={() => jaLancei(selecionadosItens)}
                    className="h-[30px] rounded-full border border-line px-3 font-semibold"
                  >
                    Já lancei
                  </button>
                  <button
                    type="button"
                    onClick={() => ignorar(selecionadosItens)}
                    className="h-[30px] rounded-full border border-line px-3 font-semibold"
                  >
                    Ignorar
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(selecionadosItens)}
                    className="h-[30px] rounded-full border border-line px-3 font-semibold hover:text-danger"
                  >
                    Excluir
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="flex-1 font-semibold text-fg2">
                  {visao === "pendente"
                    ? `${fila.length} para revisar${meta && meta.lastPage > 1 && fonte !== "extrato" ? " nesta página" : ""}`
                    : visao === "vinculado"
                      ? "Ligados a lançamentos que já existiam"
                      : "Ignorados ficam aqui para restaurar"}
                </span>
                {visao === "pendente" && possiveisDup > 0 && (
                  <button
                    type="button"
                    onClick={ignorarParecidas}
                    disabled={m.ignorarParecidas.isPending}
                    title="Mesmo valor e dia de uma transação que já existe. Dá para restaurar em Ignorados."
                    className="flex h-[30px] items-center gap-[6px] rounded-full border border-warning/40 px-3 font-semibold text-warning hover:bg-warning/10 disabled:opacity-50"
                  >
                    <CopyX className="size-[14px]" />
                    Ignorar {possiveisDup} que parece
                    {possiveisDup === 1 ? "" : "m"} já lançada
                    {possiveisDup === 1 ? "" : "s"}
                  </button>
                )}
                {visao === "ignorado" && fila.length > 0 && (
                  <>
                    {confirmandoLimpar && (
                      <button
                        type="button"
                        onClick={() => setConfirmandoLimpar(false)}
                        className="font-semibold text-fg2"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={limparIgnorados}
                      disabled={m.limparIgnorados.isPending}
                      className={cn(
                        "flex h-[30px] items-center gap-[6px] rounded-full border px-3 font-semibold",
                        confirmandoLimpar
                          ? "border-danger bg-danger text-white"
                          : "border-line text-fg2 hover:text-danger",
                      )}
                    >
                      <Trash2 className="size-[14px]" />
                      {confirmandoLimpar
                        ? "Excluir todos os ignorados"
                        : "Limpar ignorados"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <div
            ref={listaRef}
            className="nice-scroll max-h-[640px] overflow-y-auto"
          >
            {carregando ? (
              Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="mx-3 my-2 h-[46px] rounded-[10px]"
                />
              ))
            ) : fila.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-display text-xl font-bold">
                  {visao === "pendente" ? "Tudo revisado" : "Nada por aqui"}
                </p>
                <p className="mt-[6px] text-[13.5px] text-fg2">
                  {visao === "pendente"
                    ? busca || pessoaFiltro || fonte !== "tudo"
                      ? "Nada para revisar com esse filtro."
                      : "Quando os bancos trouxerem algo novo ou você importar um extrato, aparece aqui."
                    : visao === "vinculado"
                      ? "Nada ligado a lançamentos que já existiam."
                      : "Nada ignorado com esse filtro."}
                </p>
              </div>
            ) : (
              fila.map((item) => (
                <div key={item.id} data-item={item.id}>
                  <FilaItem
                    item={item}
                    categoria={categoriaDoItem(item)}
                    ativo={item.id === atual?.id}
                    selecionado={selecionados.has(item.id)}
                    ocupado={ocupados.has(item.id)}
                    onAbrir={() => setAtualId(item.id)}
                    onToggle={() => toggle(item.id)}
                  />
                </div>
              ))
            )}
          </div>

          {meta && meta.lastPage > 1 && fonte !== "extrato" && (
            <div className="flex items-center justify-between border-t border-line2 px-[14px] py-[10px] text-[12.5px] text-fg2">
              <span>
                Banco: página {meta.page} de {meta.lastPage}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-line px-3 py-1 font-semibold disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={page >= meta.lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-line px-3 py-1 font-semibold disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </section>

        {atual && (
          <div className="min-w-0 flex-[1.4_1_460px] lg:sticky lg:top-6">
            <PainelItem
              key={atual.id}
              item={atual}
              visao={visao}
              posicao={posicao}
              total={fila.length}
              ocupado={ocupados.has(atual.id)}
              opcoes={opcoes}
              edit={edits[atual.id]}
              onEditBanco={(patch) =>
                setEdits((prev) => ({
                  ...prev,
                  [atual.id]: { ...prev[atual.id], ...patch },
                }))
              }
              onEditExtrato={(patch) => extrato.atualizar(atual.id, patch)}
              onAnterior={() => navegar(-1)}
              onProximo={() => navegar(1)}
              onAceitar={() => aceitar([atual])}
              onIgnorar={() => ignorar([atual])}
              onJaLancei={(transacaoId) => jaLancei([atual], transacaoId)}
              onExcluir={() => excluir([atual])}
              onRestaurar={() => restaurar([atual])}
              onDesvincular={() => desvincular(atual)}
            />
          </div>
        )}
      </div>

      {/* Separados automaticamente */}
      {visao === "pendente" && !!r?.ignorados && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[16px] bg-track px-5 py-3 text-[12.5px] text-fg2">
          <span className="font-semibold text-fg">
            Separados automaticamente
          </span>
          {r.ignoradosPorMotivo
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((x) => (
              <span key={x.motivo}>
                {MOTIVOS_IGNORADO[x.motivo] ?? x.motivo} {x.total}
              </span>
            ))}
          <button
            type="button"
            onClick={() => trocarVisao("ignorado")}
            className="font-semibold text-primary hover:underline dark:text-[#B3A9FF]"
          >
            Ver em Ignorados
          </button>
        </div>
      )}
    </div>
  );
};

export default Revisar;
