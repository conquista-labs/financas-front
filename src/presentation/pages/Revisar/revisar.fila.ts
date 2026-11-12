import type { LancamentoExterno, LinhaImportacao } from "@/domain/models";
import { normalizar } from "@/lib/lancamento";
import type { LinhaExtrato } from "@/presentation/store/filaExtrato";

import { isoDate, toReviewLines } from "./extrato/extrato.helpers";
import type { InboxVisao } from "./revisar.helpers";

/**
 * A fila única do Revisar: o que veio do banco (sincronização, no servidor)
 * e o que veio de extrato importado (no navegador), lado a lado.
 */

export type Fonte = "tudo" | "bancos" | "extrato" | "dica";

export type ItemFila =
  | { origem: "banco"; id: string; banco: LancamentoExterno }
  | { origem: "extrato"; id: string; extrato: LinhaExtrato };

/** Pendente com dica (banco: motivo; extrato: parece já lançada). */
export const temDica = (item: ItemFila) =>
  item.origem === "banco"
    ? item.banco.status === "pendente" && !!item.banco.motivo
    : item.extrato.possivelDuplicada;

interface MontarFila {
  banco: LancamentoExterno[];
  extrato: LinhaExtrato[];
  visao: InboxVisao;
  fonte: Fonte;
  busca?: string;
  pessoaId?: string;
}

/**
 * Junta as duas origens já filtradas. O banco chega filtrado pelo servidor
 * (visão, busca, pessoa, dica); o extrato é filtrado aqui. Extrato primeiro
 * (acabou de chegar), do mais recente para o mais antigo.
 */
export const montarFila = ({
  banco,
  extrato,
  visao,
  fonte,
  busca = "",
  pessoaId = "",
}: MontarFila): ItemFila[] => {
  const termo = normalizar(busca);
  const doExtrato: ItemFila[] =
    fonte === "bancos" || visao === "vinculado"
      ? []
      : extrato
          .filter((l) => l.status === visao)
          .filter((l) => !termo || normalizar(l.descricao).includes(termo))
          .filter((l) => !pessoaId || l.pessoaId === pessoaId)
          .sort((a, b) => isoDate(b.data).localeCompare(isoDate(a.data)))
          .map((l) => ({ origem: "extrato", id: l.id, extrato: l }));
  const doBanco: ItemFila[] =
    fonte === "extrato"
      ? []
      : banco.map((l) => ({ origem: "banco", id: l.id, banco: l }));
  const todos = [...doExtrato, ...doBanco];
  return fonte === "dica" ? todos.filter(temDica) : todos;
};

/**
 * Depois de aceitar/ignorar itens, qual abrir: o seguinte ao atual que não
 * saiu da fila; no fim da fila, o anterior; fila vazia, nenhum.
 */
export const proximoId = (
  fila: ItemFila[],
  atualId: string | undefined,
  saindo: string[],
): string | undefined => {
  const fora = new Set(saindo);
  const i = fila.findIndex((x) => x.id === atualId);
  if (i === -1) return fila.find((x) => !fora.has(x.id))?.id;
  const depois = fila.slice(i + 1).find((x) => !fora.has(x.id));
  if (depois) return depois.id;
  return [...fila.slice(0, i)].reverse().find((x) => !fora.has(x.id))?.id;
};

/** Linhas da análise do extrato → linhas da fila (todas entram pendentes). */
export const linhasDoExtrato = (
  linhas: LinhaImportacao[],
  {
    arquivo,
    tag,
    agora = new Date(),
    gerarId = () => crypto.randomUUID(),
  }: { arquivo: string; tag?: string; agora?: Date; gerarId?: () => string },
): LinhaExtrato[] =>
  toReviewLines(linhas).map((l) => ({
    ...l,
    id: gerarId(),
    status: "pendente",
    arquivo,
    ...(tag ? { tag } : {}),
    importadoEm: agora.toISOString(),
  }));
