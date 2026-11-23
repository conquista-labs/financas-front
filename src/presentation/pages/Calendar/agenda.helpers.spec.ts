import {
  agruparPorFatura,
  aPagarNoMes,
  contasNosItens,
  contasPagas,
  diasComConta,
  diasDoMes,
  type TransacaoDoMes,
  valorCurto,
} from "./agenda.helpers";

const t = (extra: Partial<TransacaoDoMes>): TransacaoDoMes => ({
  id: Math.random().toString(36),
  descricao: "x",
  valor: 10,
  data: "2026-11-05",
  status: "paga",
  categoria: { id: "c", nome: "Casa", tipo: "despesa" },
  ...extra,
});

describe("diasDoMes", () => {
  it("cria todos os dias do mês e soma por tipo da categoria", () => {
    const dias = diasDoMes(
      [
        t({
          data: "2026-11-05T12:00:00.000Z",
          valor: 9800,
          categoria: { id: "s", nome: "Salário", tipo: "receita" },
        }),
        t({ data: "2026-11-05", valor: "R$ 61,40" }),
        t({ data: "2026-11-30", valor: 2800, categoria: null }),
        t({ data: "2026-12-01", valor: 1 }),
      ],
      2026,
      11,
    );
    expect(dias).toHaveLength(30);
    expect(dias[0].data).toBe("2026-11-01");
    expect(dias[4]).toMatchObject({
      dia: 5,
      totalReceitas: 9800,
      totalDespesas: 61.4,
      quantidadeTransacoes: 2,
    });
    expect(dias[4].transacoes[0]).toMatchObject({
      tipo: "receita",
      valor: 9800,
    });
    expect(dias[29].totalDespesas).toBe(2800);
  });

  it("fevereiro de ano bissexto tem 29 dias", () => {
    expect(diasDoMes([], 2028, 2)).toHaveLength(29);
  });
});

describe("contas", () => {
  const lista = [
    t({ data: "2026-11-01", status: "pendente", valor: 119.9 }),
    t({ data: "2026-11-15", status: "pendente", valor: 1024.8 }),
    t({
      data: "2026-11-20",
      status: "pendente",
      valor: 500,
      categoria: { id: "r", nome: "Freela", tipo: "receita" },
    }),
    t({
      data: "2026-11-07",
      status: "paga",
      pagaEm: "2026-11-07T10:00:00Z",
      valor: 248.17,
    }),
    t({
      data: "2026-11-05",
      status: "paga",
      pagaEm: "2026-11-05T10:00:00Z",
      valor: 2800,
    }),
    t({ data: "2026-11-06", status: "paga", valor: 30 }),
  ];

  it("dias com conta não paga", () => {
    expect([...diasComConta(lista)].sort((a, b) => a - b)).toEqual([1, 15, 20]);
  });

  it("a pagar no mês ignora receitas pendentes", () => {
    expect(aPagarNoMes(lista)).toBeCloseTo(1144.7);
  });

  it("pagas = marcadas como pagas (pagaEm), em ordem de data", () => {
    expect(contasPagas(lista).map((x) => x.data)).toEqual([
      "2026-11-05",
      "2026-11-07",
    ]);
  });
});

describe("valorCurto", () => {
  it.each([
    [-120, "-120"],
    [0, "+0"],
    [2600, "+2,6k"],
    [-6938.6, "-6,9k"],
    [3000, "+3k"],
    [12400, "+12k"],
  ])("%d → %s", (n, s) => {
    expect(valorCurto(n)).toBe(s);
  });
});

describe("agruparPorFatura", () => {
  const nubank = { id: "nu", nome: "Nubank", tipo: "credito" };
  const xp = { id: "xp", nome: "XP", tipo: "credito" };
  const pix = { id: "pix", nome: "Pix", tipo: "pix" };
  const t = (
    id: string,
    data: string,
    valor: number,
    meioPagamento: typeof nubank | null,
  ) => ({ id, data, valor, meioPagamento });

  it("junta compras do mesmo cartão e vencimento; o resto fica como conta", () => {
    const itens = agruparPorFatura([
      t("a", "2026-12-08", 35.64, nubank),
      t("luz", "2026-12-05", 180, pix),
      t("b", "2026-12-08", 48.97, nubank),
      t("c", "2026-12-08T00:00:00.000Z", 60.8, nubank),
      t("d", "2026-12-08", 260.9, xp),
    ]);
    expect(itens.map((i) => i.tipo)).toEqual(["conta", "fatura", "conta"]);
    const fatura = itens[1];
    expect(fatura).toMatchObject({
      tipo: "fatura",
      chave: "nu|2026-12-08",
      meio: "Nubank",
      data: "2026-12-08",
      total: 145.41,
    });
    if (fatura.tipo === "fatura")
      expect(fatura.itens.map((x) => x.id)).toEqual(["a", "b", "c"]);
    // A compra sozinha na XP segue como conta.
    expect(itens[2]).toMatchObject({ tipo: "conta", t: { id: "d" } });
    expect(contasNosItens(itens)).toBe(5);
  });

  it("sem cartão de crédito não agrupa nada", () => {
    const itens = agruparPorFatura([
      t("x", "2026-12-01", 10, pix),
      t("y", "2026-12-01", 20, null),
    ]);
    expect(itens.every((i) => i.tipo === "conta")).toBe(true);
  });
});
