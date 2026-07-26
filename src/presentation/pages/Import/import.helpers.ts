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
    // Usa a forma sugerida pelo backend (ex.: "parcela4x"); "à vista" é o
    // padrão só quando o campo vem ausente (compra à vista).
    formaPagamento: l.formaPagamento || "avista",
  }));

/**
 * Monta o payload de confirmação a partir das linhas marcadas para importar.
 * IDs vazios são omitidos (o backend valida como uuid — nunca enviar "").
 * `formaPagamento` (sugerida pelo /analisar ou editada pelo usuário) vai junto
 * — o backend aceita e persiste.
 */
export const toConfirmacao = (line: ReviewLine): LinhaConfirmacao => ({
  data: isoDate(line.data),
  descricao: line.descricao,
  valor: line.valor,
  ...(line.categoriaId ? { categoriaId: line.categoriaId } : {}),
  ...(line.pessoaId ? { pessoaId: line.pessoaId } : {}),
  ...(line.meioPagamentoId ? { meioPagamentoId: line.meioPagamentoId } : {}),
  ...(line.formaPagamento
    ? {
        formaPagamento:
          line.formaPagamento as LinhaConfirmacao.FormaPagamentoEnum,
      }
    : {}),
});

/** Normaliza para "yyyy-MM-dd" (formato do <input type="date">). BR ou ISO. */
export const isoDate = (value: string): string => {
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
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
