import type {
  CaixaEntradaResumo,
  GetCaixaEntradaResponse,
  LancamentoExterno,
} from "@/domain/models";

import { DICAS } from "./revisar.helpers";

/**
 * Atualização otimista da caixa de entrada: quando uma ação dá certo, o item
 * sai da lista e os contadores mudam no mesmo instante em que o painel pula
 * para o próximo — sem esperar o refetch (que chega depois e só confirma).
 */

/** Para onde o lançamento foi depois da ação. */
export type Destino =
  | "aceito"
  | "vinculado"
  | "ignorado"
  | "pendente"
  | "excluido";

const menos = (n: number) => Math.max(0, n - 1);

const somarMotivo = (
  lista: CaixaEntradaResumo["ignoradosPorMotivo"],
  motivo: string,
  delta: number,
) => {
  const tem = lista.some((x) => x.motivo === motivo);
  const nova = tem
    ? lista.map((x) =>
        x.motivo === motivo ? { ...x, total: Math.max(0, x.total + delta) } : x,
      )
    : delta > 0
      ? [...lista, { motivo, total: delta }]
      : lista;
  return nova.filter((x) => x.total > 0);
};

/** Contadores depois de mover `itens` do status atual para `para`. */
export const moverNoResumo = (
  resumo: CaixaEntradaResumo,
  itens: LancamentoExterno[],
  para: Destino,
): CaixaEntradaResumo =>
  itens.reduce<CaixaEntradaResumo>((r, l) => {
    const s = { ...r };
    // Sai de onde estava…
    if (l.status === "pendente") {
      s.pendentes = menos(s.pendentes);
      // Mesma regra do servidor: "com dica" = motivo que vira dica.
      if (l.motivo && l.motivo in DICAS) s.comDica = menos(s.comDica);
      if (l.motivo === "possivel_duplicada")
        s.possiveisDuplicadas = menos(s.possiveisDuplicadas);
    } else if (l.status === "ignorado") {
      s.ignorados = menos(s.ignorados);
      s.ignoradosPorMotivo = somarMotivo(
        s.ignoradosPorMotivo,
        l.motivo ?? "manual",
        -1,
      );
    } else if (l.status === "vinculado") {
      if (l.motivo === "vinculado_manual")
        s.vinculadosManualmente = menos(s.vinculadosManualmente);
      else s.vinculadosAutomaticamente = menos(s.vinculadosAutomaticamente);
    }
    // …e entra onde foi parar.
    if (para === "pendente") s.pendentes += 1;
    else if (para === "ignorado") {
      s.ignorados += 1;
      s.ignoradosPorMotivo = somarMotivo(s.ignoradosPorMotivo, "manual", 1);
    } else if (para === "vinculado") s.vinculadosManualmente += 1;
    else if (para === "aceito") s.aceitos += 1;
    return s;
  }, resumo);

/** Lista (qualquer visão/página em cache) sem os `ids`. */
export const tirarDaLista = (
  lista: GetCaixaEntradaResponse | undefined,
  ids: Set<string>,
): GetCaixaEntradaResponse | undefined => {
  if (!lista?.data?.rows.some((l) => ids.has(l.id))) return lista;
  return {
    ...lista,
    data: {
      ...lista.data,
      rows: lista.data.rows.filter((l) => !ids.has(l.id)),
    },
  };
};
