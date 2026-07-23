import type { LinhaConfirmacao, LinhaImportacao } from "@/domain/models";

/**
 * Linha em revisão: espelha a `LinhaImportacao` da análise, mas com os campos
 * editáveis pelo usuário (categoria/pessoa/meio) e o estado de inclusão. A
 * chave `key` é estável para o React (o backend não manda id por linha).
 */
export interface ReviewLine {
  key: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  possivelDuplicada: boolean;
  incluir: boolean;
  categoriaId: string;
  pessoaId: string;
  meioPagamentoId: string;
  formaPagamento: string;
}

/** Converte as linhas cruas da análise em linhas editáveis de revisão. */
export const toReviewLines = (linhas: LinhaImportacao[]): ReviewLine[] =>
  linhas.map((l, i) => ({
    key: `${i}-${l.data}-${l.valor}`,
    data: l.data,
    descricao: l.descricao,
    valor: l.valor,
    tipo: l.tipo,
    possivelDuplicada: l.possivelDuplicada,
    incluir: l.incluir,
    // Pré-seleciona a categoria sugerida pelo histórico (editável).
    categoriaId: l.categoriaSugerida?.id ?? "",
    pessoaId: "",
    meioPagamentoId: "",
    // Toda transação tem uma forma; "à vista" é o padrão (sem opção "limpar").
    formaPagamento: "avista",
  }));

/**
 * Monta o payload de confirmação a partir das linhas marcadas para importar.
 * IDs vazios são omitidos (o backend valida como uuid — nunca enviar "").
 *
 * `formaPagamento` ainda NÃO faz parte do contrato `LinhaConfirmacao` (o
 * backend não persiste a forma na importação). Enviamos via cast para já
 * funcionar quando o back adicionar o campo; hoje é ignorado no servidor.
 */
export const toConfirmacao = (line: ReviewLine): LinhaConfirmacao =>
  ({
    data: line.data,
    descricao: line.descricao,
    valor: line.valor,
    ...(line.categoriaId ? { categoriaId: line.categoriaId } : {}),
    ...(line.pessoaId ? { pessoaId: line.pessoaId } : {}),
    ...(line.meioPagamentoId ? { meioPagamentoId: line.meioPagamentoId } : {}),
    ...(line.formaPagamento ? { formaPagamento: line.formaPagamento } : {}),
  }) as LinhaConfirmacao;

/** "2026-07-05" (ISO) ou "05/07/2026" (BR) → "05/07". */
export const shortDate = (value: string): string => {
  const br = /^(\d{2})\/(\d{2})\/\d{4}$/.exec(value);
  if (br) return `${br[1]}/${br[2]}`;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return `${iso[3]}/${iso[2]}`;
  return value;
};

/** Total de despesas das linhas incluídas (para o rodapé). */
export const totalDespesasIncluidas = (lines: ReviewLine[]): number =>
  lines
    .filter((l) => l.incluir && l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);

/**
 * Normaliza a tag em lote: minúsculas, sem acento, espaços viram hífen. Vazia
 * → undefined (não marca nada).
 */
export const normalizeTag = (raw: string): string | undefined => {
  const slug = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return slug || undefined;
};
