import type {
  CaixaEntradaResumo,
  GetCaixaEntradaResponse,
  LancamentoExterno,
} from "@/domain/models";

import { moverNoResumo, tirarDaLista } from "./revisar.cache";

const lanc = (extra: Partial<LancamentoExterno>) =>
  ({
    id: "1",
    status: "pendente",
    motivo: null,
    ...extra,
  }) as LancamentoExterno;

const resumo = (
  extra: Partial<CaixaEntradaResumo> = {},
): CaixaEntradaResumo => ({
  pendentes: 10,
  comDica: 3,
  possiveisDuplicadas: 1,
  vinculadosAutomaticamente: 4,
  vinculadosManualmente: 2,
  aceitos: 0,
  ignorados: 5,
  ignoradosPorMotivo: [
    { motivo: "fatura", total: 4 },
    { motivo: "manual", total: 1 },
  ],
  ...extra,
});

describe("moverNoResumo", () => {
  it("aceitar um pendente tira de pendentes", () => {
    const r = moverNoResumo(resumo(), [lanc({})], "aceito");
    expect(r.pendentes).toBe(9);
    expect(r.comDica).toBe(3);
    expect(r.aceitos).toBe(1);
  });

  it("ignorar um pendente com dica de duplicada mexe em todos os contadores", () => {
    const r = moverNoResumo(
      resumo(),
      [lanc({ motivo: "possivel_duplicada" })],
      "ignorado",
    );
    expect(r.pendentes).toBe(9);
    expect(r.comDica).toBe(2);
    expect(r.possiveisDuplicadas).toBe(0);
    expect(r.ignorados).toBe(6);
    expect(r.ignoradosPorMotivo).toContainEqual({ motivo: "manual", total: 2 });
  });

  it("já lancei conta como ligado por vocês", () => {
    const r = moverNoResumo(
      resumo(),
      [lanc({}), lanc({ id: "2" })],
      "vinculado",
    );
    expect(r.pendentes).toBe(8);
    expect(r.vinculadosManualmente).toBe(4);
  });

  it("restaurar tira do motivo e some com o motivo zerado", () => {
    const r = moverNoResumo(
      resumo(),
      [lanc({ status: "ignorado", motivo: "manual" })],
      "pendente",
    );
    expect(r.ignorados).toBe(4);
    expect(r.pendentes).toBe(11);
    expect(r.ignoradosPorMotivo).toEqual([{ motivo: "fatura", total: 4 }]);
  });

  it("desvincular automático volta para pendentes", () => {
    const r = moverNoResumo(
      resumo(),
      [lanc({ status: "vinculado", motivo: "ja_lancado" })],
      "pendente",
    );
    expect(r.vinculadosAutomaticamente).toBe(3);
    expect(r.vinculadosManualmente).toBe(2);
    expect(r.pendentes).toBe(11);
  });

  it("nunca fica negativo", () => {
    const r = moverNoResumo(resumo({ pendentes: 0 }), [lanc({})], "excluido");
    expect(r.pendentes).toBe(0);
  });
});

describe("tirarDaLista", () => {
  const lista = {
    message: "",
    data: {
      meta: { page: 1 },
      rows: [lanc({ id: "a" }), lanc({ id: "b" })],
    },
  } as unknown as GetCaixaEntradaResponse;

  it("tira só os ids pedidos", () => {
    expect(
      tirarDaLista(lista, new Set(["a"]))?.data.rows.map((l) => l.id),
    ).toEqual(["b"]);
  });

  it("devolve a mesma referência quando nada muda", () => {
    expect(tirarDaLista(lista, new Set(["x"]))).toBe(lista);
  });
});
