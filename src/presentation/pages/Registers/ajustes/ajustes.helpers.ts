import { formatCurrency } from "@/lib/format";
import { normalizar } from "@/lib/lancamento";

export type FiltroCategoria = "todas" | "despesa" | "receita" | "teto";

interface CategoriaBase {
  nome: string;
  tipo: string;
  tetoGasto?: number | null;
  favorito?: boolean;
  totalLancamentos?: number;
}

/** Busca (sem acento) + chip de filtro; favoritas primeiro, depois as mais usadas. */
export const filtrarCategorias = <T extends CategoriaBase>(
  categorias: T[],
  {
    busca = "",
    filtro = "todas",
  }: { busca?: string; filtro?: FiltroCategoria },
): T[] => {
  const termo = normalizar(busca);
  return categorias
    .filter((c) => !termo || normalizar(c.nome).includes(termo))
    .filter((c) =>
      filtro === "todas"
        ? true
        : filtro === "teto"
          ? (c.tetoGasto ?? 0) > 0
          : c.tipo === filtro,
    )
    .sort(
      (a, b) =>
        Number(!!b.favorito) - Number(!!a.favorito) ||
        (b.totalLancamentos ?? 0) - (a.totalLancamentos ?? 0) ||
        a.nome.localeCompare(b.nome, "pt-BR"),
    );
};

const lancamentos = (n = 0) => `${n} ${n === 1 ? "lançamento" : "lançamentos"}`;

/** "64 lançamentos · este mês R$ 3.390,00 (97%)" */
export const resumoCategoria = (
  c: CategoriaBase,
  doMes?: { realizado: number; percentual?: number },
) => {
  const partes = [lancamentos(c.totalLancamentos)];
  if (doMes && doMes.realizado > 0)
    partes.push(
      `este mês ${formatCurrency(doMes.realizado)}` +
        ((c.tetoGasto ?? 0) > 0 && doMes.percentual !== undefined
          ? ` (${Math.round(doMes.percentual)}%)`
          : ""),
    );
  return partes.join(" · ");
};

/** "Júnior Silva" → "JS"; "Pix" → "PI". */
export const iniciais = (nome: string) => {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const TIPO_MEIO: Record<string, string> = {
  credito: "Crédito",
  debito: "Débito",
  pix: "Pix",
  dinheiro: "Dinheiro",
  boleto: "Boleto",
  outro: "Outro",
};
export const nomeTipoMeio = (tipo?: string) => TIPO_MEIO[tipo ?? ""] ?? "Outro";

/** "todo dia 5 · Moradia · Pix" */
export const resumoRecorrencia = (r: {
  diaVencimento: number;
  categoria?: { nome: string } | null;
  meioPagamento?: { nome: string } | null;
  pessoa?: { nome: string } | null;
}) =>
  [
    `todo dia ${r.diaVencimento}`,
    r.categoria?.nome,
    r.meioPagamento?.nome,
    r.pessoa?.nome,
  ]
    .filter(Boolean)
    .join(" · ");

const ddmmaaaa = (iso?: string | null) =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "";

/** "Júnior · Nubank - Cartão · desde 25/10/2026" (ou o que falta configurar). */
export const resumoConta = (c: {
  pessoa?: { nome: string } | null;
  meioPagamento?: { nome: string } | null;
  sincronizarDesde: string;
}) =>
  [
    c.pessoa?.nome ?? "sem titular",
    c.meioPagamento?.nome ?? "sem meio",
    `desde ${ddmmaaaa(c.sincronizarDesde)}`,
  ].join(" · ");
