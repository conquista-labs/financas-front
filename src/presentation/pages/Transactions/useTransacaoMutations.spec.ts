import { QueryClient } from "@tanstack/react-query";

import type { GetTransacoesResponse } from "@/domain/models";

import { aplicarNaLista } from "./useTransacaoMutations";

const resposta = (rows: { id: string; descricao: string; tags?: string[] }[]) =>
  ({
    message: "ok",
    data: { rows, meta: { total: rows.length } },
  }) as unknown as GetTransacoesResponse;

describe("aplicarNaLista", () => {
  it("muda só as transações-alvo em TODAS as listas em cache e devolve o estado anterior", () => {
    const qc = new QueryClient();
    qc.setQueryData(
      ["get-transacoes", { page: 1 }],
      resposta([
        { id: "a", descricao: "A" },
        { id: "b", descricao: "B" },
      ]),
    );
    qc.setQueryData(
      ["get-transacoes", { page: 1, status: "atrasada" }],
      resposta([{ id: "a", descricao: "A" }]),
    );
    qc.setQueryData(["outra-coisa"], "intocado");

    const antes = aplicarNaLista(qc, ["a"], (t) => ({ ...t, tags: ["x"] }));

    const p1 = qc.getQueryData<GetTransacoesResponse>([
      "get-transacoes",
      { page: 1 },
    ]);
    expect(p1?.data.rows.map((t) => t.tags)).toEqual([["x"], undefined]);
    const atrasadas = qc.getQueryData<GetTransacoesResponse>([
      "get-transacoes",
      { page: 1, status: "atrasada" },
    ]);
    expect(atrasadas?.data.rows[0].tags).toEqual(["x"]);
    expect(qc.getQueryData(["outra-coisa"])).toBe("intocado");

    // Desfazer = gravar de volta o que veio em `antes`.
    antes.forEach(([key, data]) => qc.setQueryData(key, data));
    expect(
      qc.getQueryData<GetTransacoesResponse>(["get-transacoes", { page: 1 }])
        ?.data.rows[0].tags,
    ).toBeUndefined();
  });
});
