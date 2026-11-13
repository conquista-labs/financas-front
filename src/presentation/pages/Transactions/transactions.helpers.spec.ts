import {
  agruparPorDia,
  chipsDaLinha,
  inicial,
  type LinhaTransacao,
  valorComSinal,
} from "./transactions.helpers";

const nubank = { id: "nu", nome: "Cartão Nubank", tipo: "credito" };
const pix = { id: "pix", nome: "Pix", tipo: "pix" };
const t = (extra: Partial<LinhaTransacao>): LinhaTransacao => ({
  id: Math.random().toString(36),
  descricao: "Mercado",
  valor: 10,
  data: "2026-11-09",
  categoria: { nome: "Mercado", tipo: "despesa" },
  meioPagamento: pix,
  ...extra,
});

describe("agruparPorDia", () => {
  it("agrupa na ordem que veio, com total do dia com sinal", () => {
    const grupos = agruparPorDia([
      t({ data: "2026-11-09", valor: 280 }),
      t({ data: "2026-11-09T12:00:00Z", valor: 86.3 }),
      t({ data: "2026-11-04", valor: 9800, categoria: { tipo: "receita" } }),
    ]);
    expect(grupos.map((g) => g.data)).toEqual(["2026-11-09", "2026-11-04"]);
    expect(grupos[0].total).toBe(-366.3);
    expect(grupos[0].titulo).toBe("Segunda, 09/11 · 2 lançamentos");
    expect(grupos[1].total).toBe(9800);
    expect(grupos[1].titulo).toBe("Quarta, 04/11 · 1 lançamento");
  });

  it("dia todo de um cartão de crédito vira a fatura no título", () => {
    const [g] = agruparPorDia([
      t({ data: "2026-12-15", meioPagamento: nubank }),
      t({ data: "2026-12-15", meioPagamento: nubank }),
    ]);
    expect(g.titulo).toBe(
      "Terça, 15/12 · fatura Cartão Nubank · 2 lançamentos",
    );
  });

  it("não chama de fatura se misturar meios ou for um só lançamento", () => {
    const [misto] = agruparPorDia([
      t({ meioPagamento: nubank }),
      t({ meioPagamento: pix }),
    ]);
    expect(misto.titulo).not.toContain("fatura");
    const [um] = agruparPorDia([t({ meioPagamento: nubank })]);
    expect(um.titulo).not.toContain("fatura");
  });
});

describe("chipsDaLinha", () => {
  it("parcela, tags e situação", () => {
    expect(
      chipsDaLinha(
        t({
          parcelaNumero: 2,
          totalParcelas: 6,
          tags: ["viagem-praia"],
          statusExibicao: "pendente",
        }),
      ),
    ).toEqual([
      { texto: "2/6", tom: "primary" },
      { texto: "#viagem-praia", tom: "neutral" },
      { texto: "a pagar", tom: "warning" },
    ]);
    expect(chipsDaLinha(t({ statusExibicao: "atrasada" }))).toEqual([
      { texto: "atrasada", tom: "danger" },
    ]);
    expect(
      chipsDaLinha(t({ statusExibicao: "paga", totalParcelas: 1 })),
    ).toEqual([]);
  });
});

describe("valorComSinal e inicial", () => {
  it("despesa negativa, receita positiva; aceita valor em texto", () => {
    expect(valorComSinal(t({ valor: "R$ 1.234,50" }))).toBe(-1234.5);
    expect(
      valorComSinal(t({ valor: 10, categoria: { tipo: "receita" } })),
    ).toBe(10);
  });

  it("primeira letra ou número, ignorando símbolos", () => {
    expect(inicial("iFood *Restaurante")).toBe("I");
    expect(inicial("  *99 Pop")).toBe("9");
    expect(inicial("")).toBe("?");
  });
});
