import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { MonthPicker } from "@/presentation/components";
import { useQuickAdd } from "@/presentation/components/QuickAdd";
import {
  useGetAnalyticsMeiosPagamento,
  useGetAnalyticsOrcamento,
  useGetCaixaEntradaResumo,
  useGetMetas,
  useGetQuickStats,
  useGetResumoFinanceiro,
  useGetTransacoes,
  usePostResumoFinanceiro,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";
import { useFilaExtrato } from "@/presentation/store/filaExtrato";

import {
  AnoMesAMes,
  BudgetList,
  HealthCard,
  HeroSaldo,
  KpiCards,
  MeiosPagamentoCard,
  ParaOndeFoi,
  PedeAtencao,
  RecentTransactions,
} from "./components";
import { monthNavButton } from "./home.styles";
import {
  dataPorExtenso,
  diasDasTransacoes,
  itensAtencao,
  saudacao,
  serieSaldoDoMes,
} from "./inicio.helpers";

const ISO = "yyyy-MM-dd";

/**
 * Início do "Repaginado": Visão geral + Análises numa página só. Saldo do mês
 * em destaque com a previsão até o fim do mês, o que pede atenção agora, o
 * ano mês a mês (tabela, gráfico, por categoria) e os cartões do mês.
 */
const Home = () => {
  const hoje = useMemo(() => new Date(), []);
  const { auth } = useAuthStore();
  const { openQuickAdd } = useQuickAdd();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1); // 1-12

  // ── Dados do período ───────────────────────────────────────────────────
  const resumo = useGetResumoFinanceiro({ ano });
  const stats = useGetQuickStats({ ano, mes });
  const orcamento = useGetAnalyticsOrcamento({ ano, mes });
  const meios = useGetAnalyticsMeiosPagamento({ ano, mes });
  // Todas as transações do mês, para a linha do saldo dia a dia.
  const doPeriodo = useGetTransacoes({
    page: 1,
    limit: 1000,
    startDate: format(new Date(ano, mes - 1, 1), ISO),
    endDate: format(new Date(ano, mes, 0), ISO),
  });
  const ultimas = useGetTransacoes({ page: 1, limit: 6 });

  // ── "Pede atenção" (sempre sobre hoje, não sobre o mês escolhido) ──────
  const caixa = useGetCaixaEntradaResumo();
  const extrato = useFilaExtrato((s) => s.linhas);
  // limit 1: só a mais antiga para o texto; o total vem da paginação.
  const atrasadas = useGetTransacoes({
    page: 1,
    limit: 1,
    status: "atrasada",
  });
  const proximas = useGetTransacoes({
    page: 1,
    limit: 50,
    status: "pendente",
    startDate: format(hoje, ISO),
    endDate: format(addDays(hoje, 7), ISO),
  });
  const metas = useGetMetas({ status: "ativa" });

  const { mutateAsync: recalcularResumo } = usePostResumoFinanceiro();
  const [atualizando, setAtualizando] = useState(false);
  const atualizar = async () => {
    setAtualizando(true);
    try {
      // Recalcula os saldos do ano no backend antes de recarregar.
      await recalcularResumo({ year: ano });
    } catch {
      // O hook já mostra o erro; recarrega mesmo assim.
    }
    await Promise.all(
      [
        resumo,
        stats,
        orcamento,
        meios,
        doPeriodo,
        ultimas,
        caixa,
        atrasadas,
        proximas,
        metas,
      ].map((q) => q.refetch()),
    );
    setAtualizando(false);
  };

  // ── Derivados ──────────────────────────────────────────────────────────
  const saldosMes = resumo.data?.data?.saldosMes ?? [];
  const doMes = saldosMes[mes - 1];
  const porCategoria = resumo.data?.data?.despesasPorCategoriaMes ?? [];
  const orcamentoRows = orcamento.data?.data?.orcamentoCategorias ?? [];
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const { pontos, corte } = serieSaldoDoMes(
    diasDasTransacoes(doPeriodo.data?.data?.rows ?? [], diasNoMes),
    { ano, mes, hoje },
  );

  const extratoPend = extrato.filter((l) => l.status === "pendente");
  const atencao = itensAtencao({
    paraRevisar: (caixa.data?.data?.pendentes ?? 0) + extratoPend.length,
    dicasDuplicidade:
      (caixa.data?.data?.possiveisDuplicadas ?? 0) +
      extratoPend.filter((l) => l.possivelDuplicada).length,
    contasAtrasadas: {
      total: atrasadas.data?.data?.meta?.total ?? 0,
      primeira: atrasadas.data?.data?.rows?.[0] && {
        descricao: atrasadas.data.data.rows[0].descricao,
        valor: Number(atrasadas.data.data.rows[0].valor),
      },
    },
    contasProximas: {
      total: proximas.data?.data?.meta?.total ?? 0,
      valor: (proximas.data?.data?.rows ?? []).reduce(
        (soma, t) => soma + Number(t.valor),
        0,
      ),
    },
    estouradas: orcamentoRows
      .filter((o) => o.valorOrcado > 0 && o.valorRealizado > o.valorOrcado)
      .map((o) => ({
        nome: o.categoriaNome,
        realizado: o.valorRealizado,
        orcado: o.valorOrcado,
      })),
    metasAtingidas: (metas.data?.data ?? [])
      .filter((m) => m.status === "ativa" && m.percentual >= 100)
      .map((m) => ({ titulo: m.titulo })),
    rotas: {
      revisar: urlRouters.revisar,
      agenda: urlRouters.agenda,
      ajustes: urlRouters.ajustes,
      metas: urlRouters.goals,
    },
  });
  const carregandoAtencao =
    caixa.isLoading || atrasadas.isLoading || proximas.isLoading;

  const primeiroNome = (auth.user?.nome ?? "").split(" ")[0];
  const mesNome = format(new Date(ano, mes - 1, 1), "MMMM", { locale: ptBR });

  return (
    <div className="flex animate-om-fade flex-col gap-4 pb-8">
      {/* Cabeçalho */}
      <header className="-order-2 flex flex-wrap items-center justify-between gap-3 lg:order-none">
        <div>
          <p className="text-sm text-fg2">{dataPorExtenso(hoje)}</p>
          <h1 className="mt-[2px] font-display text-[26px] font-bold sm:text-[32px] -tracking-[0.03em] text-fg">
            {saudacao(hoje)}
            {primeiroNome && `, ${primeiroNome}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker
            month={mes}
            year={ano}
            onChange={(m, y) => {
              setMes(m);
              setAno(y);
            }}
          />
          <button
            type="button"
            aria-label="Atualizar dados"
            title="Recalcula o resumo do ano"
            onClick={atualizar}
            disabled={atualizando}
            className={cn(
              monthNavButton(),
              "hidden disabled:opacity-60 lg:grid",
            )}
          >
            <RefreshCw
              className={cn("size-[17px]", atualizando && "animate-spin")}
            />
          </button>
          <button
            type="button"
            onClick={openQuickAdd}
            className="hidden h-[42px] items-center gap-[6px] rounded-full bg-primary px-[18px] lg:flex text-sm font-bold text-white shadow-primary transition-colors hover:bg-primary-strong"
          >
            <Plus className="size-4" strokeWidth={2.6} /> Lançar
          </button>
        </div>
      </header>

      {/* Saldo + Pede atenção */}
      <div className="-order-1 flex flex-wrap gap-4 lg:order-none">
        <div className="min-w-0 flex-[2_1_540px]">
          <HeroSaldo
            mesNome={mesNome}
            // Como no protótipo: o que sobrou no mês (entrou − saiu).
            saldo={
              doMes ? (doMes.receita ?? 0) - (doMes.despesa ?? 0) : undefined
            }
            receitas={doMes?.receita}
            despesas={doMes?.despesa}
            pontos={pontos}
            corte={corte}
            diasNoMes={diasNoMes}
            isLoading={resumo.isLoading}
          />
        </div>
        <div className="flex min-w-0 flex-[1_1_300px] flex-col [&>section]:flex-1">
          <PedeAtencao itens={atencao} isLoading={carregandoAtencao} />
        </div>
      </div>

      {/* No celular a ordem segue o protótipo mobile: saldo, pede atenção e
          orçamento primeiro; a tabela do ano vai para o fim. */}
      <div className="order-last lg:order-none">
        <AnoMesAMes
        saldosMes={saldosMes}
        porCategoria={porCategoria}
        mes={mes}
        onSelectMonth={setMes}
        isLoading={resumo.isLoading}
        />
      </div>

      <KpiCards
        gastoSemana={stats.data?.data?.gastoSemana}
        economiaMes={stats.data?.data?.economiaMes}
        maiorCategoria={stats.data?.data?.maiorCategoria}
        transacaoMaior={stats.data?.data?.transacaoMaior}
        isLoading={stats.isLoading}
      />

      <div className="-order-1 grid gap-4 lg:order-none lg:grid-cols-2">
        <BudgetList rows={orcamentoRows} isLoading={orcamento.isLoading} />
        <ParaOndeFoi
          categorias={porCategoria[mes - 1]?.categorias ?? []}
          isLoading={resumo.isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HealthCard
          saude={orcamento.data?.data?.saudeFinanceira}
          isLoading={orcamento.isLoading}
        />
        <MeiosPagamentoCard
          rows={meios.data?.data?.meiosPagamento ?? []}
          isLoading={meios.isLoading}
        />
      </div>

      <RecentTransactions
        rows={ultimas.data?.data?.rows}
        isLoading={ultimas.isLoading}
      />
    </div>
  );
};

export default Home;
