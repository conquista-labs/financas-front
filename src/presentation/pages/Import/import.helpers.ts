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
  /** Propagar as parcelas futuras (só faz efeito se parcelada). */
  propagarParcelas: boolean;
  /**
   * A análise trouxe uma categoria sugerida (palpite do histórico). Fixo na
   * origem — não muda quando o usuário edita a categoria. Alimenta o badge
   * "Sugerido" e o contador de "prontas".
   */
  categoriaSugerida: boolean;
}

/** Nº de parcelas se a forma for "parcelaNx" com N≥2; senão 0 (não parcelada). */
export const numParcelas = (formaPagamento: string): number => {
  const m = /^parcela(\d+)x$/.exec(formaPagamento);
  const n = m ? Number(m[1]) : 0;
  return n >= 2 ? n : 0;
};

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
    // Propagar é escolha consciente do usuário → desligado por padrão.
    propagarParcelas: false,
    categoriaSugerida: Boolean(l.categoriaSugerida?.id),
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
  ...(line.propagarParcelas ? { propagarParcelas: true } : {}),
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

/** Linha está "pronta" = incluída e com categoria já definida (sugerida ou escolhida). */
export const isReady = (l: ReviewLine): boolean =>
  l.incluir && Boolean(l.categoriaId);

/** Linha "precisa de você" = incluída mas ainda sem categoria. */
export const needsAttention = (l: ReviewLine): boolean =>
  l.incluir && !l.categoriaId;

/** Linha parcelada (forma "parcelaNx", N≥2). */
export const isParcelada = (l: ReviewLine): boolean =>
  numParcelas(l.formaPagamento) >= 2;

/** Abas de filtro da revisão. */
export type ReviewFilter = "todas" | "revisar" | "duplicadas" | "parceladas";

/** Contadores para os KPIs do topo e os selos das abas. */
export interface ReviewCounts {
  lidas: number;
  prontas: number;
  atencao: number;
  duplicadas: number;
  parceladas: number;
}

export const countLines = (lines: ReviewLine[]): ReviewCounts => ({
  lidas: lines.length,
  prontas: lines.filter(isReady).length,
  atencao: lines.filter(needsAttention).length,
  duplicadas: lines.filter((l) => l.possivelDuplicada).length,
  parceladas: lines.filter(isParcelada).length,
});

/**
 * Aplica aba + busca sobre as linhas. A busca casa por descrição (case/acento
 * insensível). Retorna as linhas na ordem original.
 */
export const filterLines = (
  lines: ReviewLine[],
  filter: ReviewFilter,
  query: string,
): ReviewLine[] => {
  const q = query.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return lines.filter((l) => {
    if (filter === "revisar" && !needsAttention(l)) return false;
    if (filter === "duplicadas" && !l.possivelDuplicada) return false;
    if (filter === "parceladas" && !isParcelada(l)) return false;
    if (q) {
      const desc = l.descricao
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      if (!desc.includes(q)) return false;
    }
    return true;
  });
};

/**
 * Chave para agrupar lançamentos "iguais": mesma descrição normalizada. Usada
 * pelo "aplicar aos N iguais" (propaga categoria/pessoa/meio para os pares).
 */
export const sameKey = (l: ReviewLine): string =>
  l.descricao
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ");

/** Quantas outras linhas têm a mesma descrição desta (exclui a própria). */
export const countSame = (lines: ReviewLine[], line: ReviewLine): number => {
  const key = sameKey(line);
  return lines.filter((l) => l.key !== line.key && sameKey(l) === key).length;
};

/** Total de parcelas futuras que serão agendadas (soma das linhas com propagar). */
export const totalFuturasAgendadas = (lines: ReviewLine[]): number =>
  lines
    .filter((l) => l.incluir && l.propagarParcelas)
    .reduce(
      (acc, l) => acc + Math.max(0, numParcelas(l.formaPagamento) - 1),
      0,
    );

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
