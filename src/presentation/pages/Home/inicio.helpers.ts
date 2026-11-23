import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/lib/format";

/** "Bom dia" até 11h59, "Boa tarde" até 17h59, "Boa noite" depois. */
export const saudacao = (agora: Date) => {
  const h = agora.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

/** "Terça, 10 de novembro". */
export const dataPorExtenso = (agora: Date) => {
  const s = format(agora, "EEEE, d 'de' MMMM", { locale: ptBR }).replace(
    "-feira",
    "",
  );
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Quanto da renda sobrou (0–100, arredondado); null sem renda. */
export const percentualGuardado = (saldo?: number, receita?: number) =>
  receita && receita > 0 && saldo !== undefined
    ? Math.round((saldo / receita) * 100)
    : null;

export interface PontoSaldo {
  /** 1–12 */
  mes: number;
  /** Saldo acumulado no fim do mês. */
  saldo: number;
  /** Quanto o saldo mudou no mês (entrou − saiu). */
  delta: number;
}

/**
 * Saldo no fim de cada mês do ano (o mesmo da coluna "Saldo" da tabela).
 * `corte` é o último mês "real": até ele a linha é cheia; depois, só o que já
 * está lançado para frente, desenhado tracejado como previsão.
 * - ano passado: corte = 12 (tudo real);
 * - ano futuro: corte = 0 (tudo previsão);
 * - ano atual: corte = mês de hoje.
 */
export const serieSaldoDoAno = (
  saldosMes: { valor: number; receita: number; despesa: number }[],
  { ano, hoje }: { ano: number; hoje: Date },
): { pontos: PontoSaldo[]; corte: number } => {
  const pontos = saldosMes.slice(0, 12).map((m, i) => ({
    mes: i + 1,
    saldo: m.valor ?? 0,
    delta: Math.round(((m.receita ?? 0) - (m.despesa ?? 0)) * 100) / 100,
  }));
  const anoHoje = hoje.getFullYear();
  const corte = ano < anoHoje ? 12 : ano > anoHoje ? 0 : hoje.getMonth() + 1;
  return { pontos, corte };
};

/**
 * Escala vertical do gráfico do saldo: devolve v → posição de 0 (base) a 1
 * (topo). Comprimida ("symlog": sinal × log(1 + |v|/k), com k = 1% do maior
 * valor) para um mês muito alto — ex.: janeiro com R$ 48 mil — não achatar os
 * outros meses numa linha reta. Mantém a ordem e o sinal; o hover mostra os
 * valores exatos. A faixa vai do menor ao maior valor da série (o zero só
 * entra se algum mês ficar negativo).
 */
export const escalaDoSaldo = (valores: number[]) => {
  const k = Math.max(1, Math.max(0, ...valores.map(Math.abs)) / 100);
  const f = (v: number) => Math.sign(v) * Math.log10(1 + Math.abs(v) / k);
  const fs = valores.map(f);
  const lo = Math.min(...fs);
  const hi = Math.max(...fs);
  const faixa = hi - lo;
  return (v: number) => (faixa > 0 ? (f(v) - lo) / faixa : 0.5);
};

export type TomAtencao = "primary" | "danger" | "warning" | "success";

export interface ItemAtencao {
  id: string;
  /** O que vai na bolinha (número ou símbolo). */
  marca: string;
  titulo: string;
  detalhe: string;
  tom: TomAtencao;
  href: string;
}

interface EntradaAtencao {
  paraRevisar: number;
  dicasDuplicidade: number;
  /** Contas pendentes vencendo de hoje até +7 dias (total e soma). */
  contasProximas: { total: number; valor: number };
  /** Contas pendentes já vencidas: total (da paginação) e a mais antiga. */
  contasAtrasadas: {
    total: number;
    primeira?: { descricao: string; valor: number };
  };
  /** Categorias acima de 100% do teto no mês. */
  estouradas: {
    nome: string;
    realizado: number;
    orcado: number;
    categoriaId?: string;
  }[];
  /** Mês analisado (AAAA-MM-DD): o teto leva às transações dele. */
  periodo?: { inicio: string; fim: string };
  /** Metas ativas que já atingiram o alvo. */
  metasAtingidas: { titulo: string }[];
  rotas: {
    revisar: string;
    agenda: string;
    ajustes: string;
    metas: string;
    transacoes?: string;
  };
}

const plural = (n: number, s: string, p = `${s}s`) => (n === 1 ? s : p);

/**
 * "Pede atenção": só o que precisa de uma ação agora, na ordem do protótipo —
 * revisar, contas, teto estourado, meta atingida. Vazio = tudo em dia.
 */
export const itensAtencao = (e: EntradaAtencao): ItemAtencao[] => {
  const itens: ItemAtencao[] = [];

  if (e.paraRevisar > 0)
    itens.push({
      id: "revisar",
      marca: String(e.paraRevisar),
      titulo: "Para revisar",
      detalhe:
        `${e.paraRevisar} ${plural(e.paraRevisar, "lançamento")} do banco ou extrato` +
        (e.dicasDuplicidade
          ? ` · ${e.dicasDuplicidade} ${plural(e.dicasDuplicidade, "dica")} de duplicidade`
          : ""),
      tom: "primary",
      href: e.rotas.revisar,
    });

  const atrasadas = e.contasAtrasadas.total;
  const proximas = e.contasProximas.total;
  if (atrasadas + proximas > 0) {
    const primeira = e.contasAtrasadas.primeira;
    itens.push({
      id: "contas",
      marca: String(atrasadas + proximas),
      titulo: proximas
        ? "Contas nos próximos 7 dias"
        : plural(atrasadas, "Conta atrasada", "Contas atrasadas"),
      detalhe:
        atrasadas && primeira
          ? `${primeira.descricao} está atrasada · ${formatCurrency(primeira.valor)}` +
            (atrasadas > 1
              ? ` · +${atrasadas - 1} ${plural(atrasadas - 1, "atrasada")}`
              : "")
          : `${formatCurrency(e.contasProximas.valor)} a pagar`,
      tom: atrasadas ? "danger" : "warning",
      href: e.rotas.agenda,
    });
  }

  if (e.estouradas.length) {
    const pior = [...e.estouradas].sort(
      (a, b) => b.realizado / b.orcado - a.realizado / a.orcado,
    )[0];
    const pct = Math.round((pior.realizado / pior.orcado) * 100);
    itens.push({
      id: "teto",
      marca: "!",
      titulo:
        e.estouradas.length === 1
          ? `${pior.nome} passou do teto`
          : `${e.estouradas.length} categorias passaram do teto`,
      detalhe: `${pior.nome}: ${formatCurrency(pior.realizado)} de ${formatCurrency(pior.orcado)} (${pct}%)`,
      tom: "warning",
      // O que explica o estouro são os gastos: abre Transações filtrada pela
      // categoria mais estourada no mês. Sem esses dados, cai em Ajustes.
      href:
        pior.categoriaId && e.periodo && e.rotas.transacoes
          ? `${e.rotas.transacoes}?${new URLSearchParams({
              categoriaId: pior.categoriaId,
              startDate: e.periodo.inicio,
              endDate: e.periodo.fim,
            })}`
          : e.rotas.ajustes,
    });
  }

  if (e.metasAtingidas.length) {
    const [m] = e.metasAtingidas;
    itens.push({
      id: "meta",
      marca: "★",
      titulo:
        e.metasAtingidas.length === 1
          ? `${m.titulo} chegou lá`
          : `${e.metasAtingidas.length} metas chegaram lá`,
      detalhe: "Hora de marcar como concluída",
      tom: "success",
      href: e.rotas.metas,
    });
  }

  return itens;
};
