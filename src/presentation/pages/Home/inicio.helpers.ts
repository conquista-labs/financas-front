import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency, parseAmount } from "@/lib/format";

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

/**
 * Entradas e saídas por dia do mês a partir das transações (todas — o
 * endpoint de calendário só traz as marcadas com "lembrar-me"). O tipo vem da
 * categoria; sem categoria conta como despesa, como na API.
 */
export const diasDasTransacoes = (
  transacoes: {
    data: string;
    valor: number | string;
    categoria?: { tipo?: string } | null;
  }[],
  diasNoMes: number,
) => {
  const dias = Array.from({ length: diasNoMes }, (_, i) => ({
    dia: i + 1,
    totalReceitas: 0,
    totalDespesas: 0,
  }));
  for (const t of transacoes) {
    const dia = Number(t.data.slice(8, 10));
    const d = dias[dia - 1];
    if (!d) continue;
    const v = parseAmount(t.valor);
    if (t.categoria?.tipo === "receita") d.totalReceitas += v;
    else d.totalDespesas += v;
  }
  return dias;
};

export interface PontoSaldo {
  dia: number;
  saldo: number;
}

/**
 * Saldo acumulado dia a dia no mês (entradas − saídas). `corte` é o último
 * dia "real": até ele a linha é cheia; depois, só contas a pagar/receber já
 * agendadas, desenhadas tracejadas como previsão.
 * - mês passado: corte = último dia (tudo real);
 * - mês futuro: corte = 0 (tudo previsão);
 * - mês atual: corte = hoje.
 */
export const serieSaldoDoMes = (
  dias: { dia: number; totalReceitas: number; totalDespesas: number }[],
  { ano, mes, hoje }: { ano: number; mes: number; hoje: Date },
): { pontos: PontoSaldo[]; corte: number } => {
  let acumulado = 0;
  const pontos = [...dias]
    .sort((a, b) => a.dia - b.dia)
    .map((d) => {
      acumulado += (d.totalReceitas ?? 0) - (d.totalDespesas ?? 0);
      return { dia: d.dia, saldo: Math.round(acumulado * 100) / 100 };
    });
  const ultimoDia = pontos.at(-1)?.dia ?? 0;
  const atual = ano * 12 + (mes - 1);
  const deHoje = hoje.getFullYear() * 12 + hoje.getMonth();
  const corte =
    atual < deHoje ? ultimoDia : atual > deHoje ? 0 : hoje.getDate();
  return { pontos, corte };
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
  estouradas: { nome: string; realizado: number; orcado: number }[];
  /** Metas ativas que já atingiram o alvo. */
  metasAtingidas: { titulo: string }[];
  rotas: { revisar: string; agenda: string; ajustes: string; metas: string };
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
      href: e.rotas.ajustes,
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
