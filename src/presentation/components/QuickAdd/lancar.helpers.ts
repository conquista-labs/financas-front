import { format, parse } from "date-fns";

import type {
  CreateRecorrenciaRequest,
  CreateTransacaoRequest,
} from "@/domain/models";

export type Tipo = "despesa" | "receita";
export type Repeticao = "unico" | "mensal" | "parcelar";
export type Situacao = "paga" | "pendente";

/** Campos já resolvidos do Lançar (frase interpretada + ajustes manuais). */
export interface CamposLancamento {
  tipo: Tipo;
  valor: number; // total digitado
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  data: string; // yyyy-MM-dd
  descricao: string;
  repeticao: Repeticao;
  parcelas: number;
  status: Situacao;
  tags: string[];
  observacoes: string;
}

export interface Envio {
  transacao?: CreateTransacaoRequest;
  recorrencia?: CreateRecorrenciaRequest;
}

/** Arredonda para centavos. */
const centavos = (n: number) => Math.round(n * 100) / 100;

/**
 * Valor de cada parcela. A API grava o `valor` enviado em CADA parcela (não
 * divide), então o Lançar divide o total digitado. Ex.: 312,45 em 3x → 104,15.
 */
export const valorPorParcela = (total: number, parcelas: number) =>
  parcelas > 1 ? centavos(total / parcelas) : centavos(total);

/** Erro de validação para mostrar ao usuário, ou null se dá para salvar. */
export const validar = (c: CamposLancamento): string | null => {
  if (!(c.valor > 0)) return "Informe um valor.";
  if (!c.categoriaId) return "Escolha uma categoria.";
  if (!c.data) return "Informe a data.";
  return null;
};

/**
 * Monta o que vai para a API.
 * - Único / Parcelar → POST /transacoes (parcelado: valor por parcela +
 *   `parcelaNx`; a API cria as N parcelas, uma por mês).
 * - Mensal → POST /recorrencias com o dia da data. A API gera as pendências
 *   do horizonte a partir de HOJE; se a data já passou neste mês, também cria
 *   o lançamento deste mês (senão ele se perderia).
 */
export const montarEnvio = (
  c: CamposLancamento,
  {
    hoje = new Date(),
    nomeCategoria = "",
  }: { hoje?: Date; nomeCategoria?: string } = {},
): Envio => {
  const descricao = c.descricao.trim() || nomeCategoria || "Lançamento";
  const opcionais = {
    ...(c.pessoaId ? { pessoaId: c.pessoaId } : {}),
    ...(c.meioPagamentoId ? { meioPagamentoId: c.meioPagamentoId } : {}),
  };
  const parcelado = c.repeticao === "parcelar" && c.parcelas > 1;

  const transacao = {
    descricao,
    categoriaId: c.categoriaId,
    valor: parcelado ? valorPorParcela(c.valor, c.parcelas) : centavos(c.valor),
    data: new Date(`${c.data}T12:00:00`).toISOString(),
    formaPagamento: parcelado ? `parcela${c.parcelas}x` : "avista",
    status: c.status,
    ...opcionais,
    ...(c.tags.length ? { tags: c.tags } : {}),
    ...(c.observacoes.trim() ? { observacoes: c.observacoes.trim() } : {}),
  } as CreateTransacaoRequest;

  if (c.repeticao !== "mensal") return { transacao };

  const data = parse(c.data, "yyyy-MM-dd", hoje);
  const recorrencia: CreateRecorrenciaRequest = {
    descricao,
    valor: centavos(c.valor),
    diaVencimento: data.getDate(),
    categoriaId: c.categoriaId,
    ...opcionais,
  };
  const jaPassou = c.data < format(hoje, "yyyy-MM-dd");
  return jaPassou ? { transacao, recorrencia } : { recorrencia };
};
