import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ReviewLine } from "@/presentation/pages/Revisar/extrato/extrato.helpers";

/**
 * Linha de extrato importado esperando revisão no Revisar.
 *
 * Fica SÓ no navegador (localStorage): o extrato não vai para o banco até
 * virar transação. Aceitar chama /importacoes/confirmar com a linha; ignorar
 * e excluir são locais. Reimportar o mesmo arquivo traz as linhas de novo.
 */
export interface LinhaExtrato extends ReviewLine {
  id: string;
  status: "pendente" | "ignorado";
  /** Nome do arquivo de onde veio (mostrado como "conta" na fila). */
  arquivo: string;
  /** Tag aplicada ao importar (ex.: "fatura-nubank-nov"). */
  tag?: string;
  importadoEm: string;
}

interface FilaExtratoState {
  linhas: LinhaExtrato[];
  adicionar: (linhas: LinhaExtrato[]) => void;
  atualizar: (id: string, patch: Partial<LinhaExtrato>) => void;
  atualizarVarias: (ids: string[], patch: Partial<LinhaExtrato>) => void;
  ignorar: (ids: string[]) => void;
  restaurar: (ids: string[]) => void;
  remover: (ids: string[]) => void;
  limparIgnorados: () => number;
}

const comIds =
  (ids: string[], fn: (l: LinhaExtrato) => LinhaExtrato) =>
  (linhas: LinhaExtrato[]) => {
    const alvo = new Set(ids);
    return linhas.map((l) => (alvo.has(l.id) ? fn(l) : l));
  };

export const useFilaExtrato = create<FilaExtratoState>()(
  persist(
    (set, get) => ({
      linhas: [],
      adicionar: (novas) => set((s) => ({ linhas: [...novas, ...s.linhas] })),
      atualizar: (id, patch) =>
        set((s) => ({
          linhas: comIds([id], (l) => ({ ...l, ...patch }))(s.linhas),
        })),
      atualizarVarias: (ids, patch) =>
        set((s) => ({
          linhas: comIds(ids, (l) => ({ ...l, ...patch }))(s.linhas),
        })),
      ignorar: (ids) =>
        set((s) => ({
          linhas: comIds(ids, (l) => ({ ...l, status: "ignorado" }))(s.linhas),
        })),
      restaurar: (ids) =>
        set((s) => ({
          linhas: comIds(ids, (l) => ({ ...l, status: "pendente" }))(s.linhas),
        })),
      remover: (ids) => {
        const alvo = new Set(ids);
        set((s) => ({ linhas: s.linhas.filter((l) => !alvo.has(l.id)) }));
      },
      limparIgnorados: () => {
        const n = get().linhas.filter((l) => l.status === "ignorado").length;
        set((s) => ({
          linhas: s.linhas.filter((l) => l.status !== "ignorado"),
        }));
        return n;
      },
    }),
    { name: "ng-fila-extrato", version: 1 },
  ),
);

/** Quantas linhas do extrato esperam revisão (para o contador da sidebar). */
export const useExtratoPendentes = () =>
  useFilaExtrato((s) => s.linhas.filter((l) => l.status === "pendente").length);
