import type { LancamentoExterno, LinhaImportacao } from "@/domain/models";
import type { LinhaExtrato } from "@/presentation/store/filaExtrato";

import {
  type ItemFila,
  linhasDoExtrato,
  montarFila,
  proximoId,
  temDica,
} from "./revisar.fila";

const banco = (id: string, extra: Partial<LancamentoExterno> = {}) =>
  ({
    id,
    data: "2026-11-05",
    descricao: `Banco ${id}`,
    valor: 10,
    tipo: "despesa",
    status: "pendente",
    motivo: null,
    ...extra,
  }) as LancamentoExterno;

const extrato = (
  id: string,
  extra: Partial<LinhaExtrato> = {},
): LinhaExtrato => ({
  id,
  key: id,
  data: "2026-11-01",
  descricao: `Extrato ${id}`,
  valor: 20,
  tipo: "despesa",
  possivelDuplicada: false,
  incluir: true,
  categoriaId: "",
  pessoaId: "",
  meioPagamentoId: "",
  formaPagamento: "avista",
  propagarParcelas: false,
  categoriaSugerida: false,
  status: "pendente",
  arquivo: "nubank.ofx",
  importadoEm: "2026-11-12T10:00:00.000Z",
  ...extra,
});

const ids = (fila: ItemFila[]) => fila.map((x) => x.id);

describe("montarFila", () => {
  const base = {
    banco: [banco("b1"), banco("b2", { motivo: "possivel_duplicada" })],
    extrato: [
      extrato("e1", { data: "2026-10-01" }),
      extrato("e2", { data: "2026-11-03", possivelDuplicada: true }),
      extrato("e3", { status: "ignorado" }),
    ],
  };

  it("extrato primeiro (mais recente antes), depois banco", () => {
    expect(
      ids(montarFila({ ...base, visao: "pendente", fonte: "tudo" })),
    ).toEqual(["e2", "e1", "b1", "b2"]);
  });

  it("filtra por fonte", () => {
    expect(
      ids(montarFila({ ...base, visao: "pendente", fonte: "bancos" })),
    ).toEqual(["b1", "b2"]);
    expect(
      ids(montarFila({ ...base, visao: "pendente", fonte: "extrato" })),
    ).toEqual(["e2", "e1"]);
    expect(
      ids(montarFila({ ...base, visao: "pendente", fonte: "dica" })),
    ).toEqual(["e2", "b2"]);
  });

  it("ignorados do extrato aparecem em Ignorados; Já lançados é só banco", () => {
    expect(
      ids(montarFila({ ...base, banco: [], visao: "ignorado", fonte: "tudo" })),
    ).toEqual(["e3"]);
    expect(
      ids(
        montarFila({ ...base, banco: [], visao: "vinculado", fonte: "tudo" }),
      ),
    ).toEqual([]);
  });

  it("busca (sem acento) e pessoa valem para o extrato", () => {
    const fila = montarFila({
      banco: [],
      extrato: [
        extrato("a", { descricao: "Farmácia São João", pessoaId: "p1" }),
        extrato("b", { descricao: "Mercado", pessoaId: "p2" }),
      ],
      visao: "pendente",
      fonte: "tudo",
      busca: "farmacia",
    });
    expect(ids(fila)).toEqual(["a"]);
    expect(
      ids(
        montarFila({
          banco: [],
          extrato: [
            extrato("a", { pessoaId: "p1" }),
            extrato("b", { pessoaId: "p2" }),
          ],
          visao: "pendente",
          fonte: "tudo",
          pessoaId: "p2",
        }),
      ),
    ).toEqual(["b"]);
  });
});

describe("temDica", () => {
  it("banco pendente com motivo; extrato que parece duplicada", () => {
    expect(
      temDica({
        origem: "banco",
        id: "1",
        banco: banco("1", { motivo: "conta_recorrente" }),
      }),
    ).toBe(true);
    expect(temDica({ origem: "banco", id: "1", banco: banco("1") })).toBe(
      false,
    );
    expect(
      temDica({
        origem: "banco",
        id: "1",
        banco: banco("1", { status: "ignorado", motivo: "fatura" }),
      }),
    ).toBe(false);
    expect(
      temDica({
        origem: "extrato",
        id: "2",
        extrato: extrato("2", { possivelDuplicada: true }),
      }),
    ).toBe(true);
  });
});

describe("proximoId", () => {
  const fila = ["a", "b", "c", "d"].map(
    (id) => ({ origem: "banco", id, banco: banco(id) }) as ItemFila,
  );

  it("vai para o seguinte que não saiu", () => {
    expect(proximoId(fila, "b", ["b"])).toBe("c");
    expect(proximoId(fila, "b", ["b", "c"])).toBe("d");
  });

  it("no fim da fila volta para o anterior", () => {
    expect(proximoId(fila, "d", ["d"])).toBe("c");
  });

  it("sem atual, o primeiro que ficou; tudo saiu, nenhum", () => {
    expect(proximoId(fila, undefined, ["a"])).toBe("b");
    expect(proximoId(fila, "a", ["a", "b", "c", "d"])).toBeUndefined();
  });
});

describe("linhasDoExtrato", () => {
  it("vira linha pendente com id, arquivo, tag e categoria sugerida", () => {
    const linha: LinhaImportacao = {
      data: "05/11/2026",
      descricao: "Drogasil",
      valor: 54.9,
      tipo: "despesa",
      categoriaSugerida: { id: "cat-saude", nome: "Saúde" },
      formaPagamento: "parcela3x",
      possivelDuplicada: true,
      incluir: false,
    };
    const [l] = linhasDoExtrato([linha], {
      arquivo: "fatura.csv",
      tag: "fatura-nov",
      agora: new Date("2026-11-12T10:00:00Z"),
      gerarId: () => "id-1",
    });
    expect(l).toMatchObject({
      id: "id-1",
      status: "pendente",
      arquivo: "fatura.csv",
      tag: "fatura-nov",
      categoriaId: "cat-saude",
      formaPagamento: "parcela3x",
      possivelDuplicada: true,
      importadoEm: "2026-11-12T10:00:00.000Z",
    });
  });
});
