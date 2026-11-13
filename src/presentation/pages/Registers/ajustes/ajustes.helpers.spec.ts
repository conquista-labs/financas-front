import {
  filtrarCategorias,
  iniciais,
  nomeTipoMeio,
  resumoCategoria,
  resumoConta,
  resumoRecorrencia,
} from "./ajustes.helpers";

const cats = [
  { nome: "Mercado", tipo: "despesa", tetoGasto: 1800, totalLancamentos: 118 },
  { nome: "Salário", tipo: "receita", totalLancamentos: 22, favorito: true },
  { nome: "Farmácia", tipo: "despesa", tetoGasto: 0, totalLancamentos: 38 },
  {
    nome: "Moradia",
    tipo: "despesa",
    tetoGasto: 3500,
    totalLancamentos: 64,
    favorito: true,
  },
];

describe("filtrarCategorias", () => {
  it("favoritas primeiro, depois mais lançamentos", () => {
    expect(filtrarCategorias(cats, {}).map((c) => c.nome)).toEqual([
      "Moradia",
      "Salário",
      "Mercado",
      "Farmácia",
    ]);
  });

  it("chips: despesa, receita, com teto", () => {
    expect(
      filtrarCategorias(cats, { filtro: "receita" }).map((c) => c.nome),
    ).toEqual(["Salário"]);
    expect(
      filtrarCategorias(cats, { filtro: "teto" }).map((c) => c.nome),
    ).toEqual(["Moradia", "Mercado"]);
    expect(filtrarCategorias(cats, { filtro: "despesa" })).toHaveLength(3);
  });

  it("busca sem acento", () => {
    expect(
      filtrarCategorias(cats, { busca: "farmacia" }).map((c) => c.nome),
    ).toEqual(["Farmácia"]);
  });
});

describe("resumos", () => {
  it("categoria: lançamentos + este mês (com % só se tem teto)", () => {
    expect(
      resumoCategoria(cats[0], { realizado: 2140, percentual: 118.9 }),
    ).toMatch(/^118 lançamentos · este mês R\$\s?2\.140,00 \(119%\)$/);
    expect(resumoCategoria(cats[2], { realizado: 186, percentual: 0 })).toMatch(
      /^38 lançamentos · este mês R\$\s?186,00$/,
    );
    expect(resumoCategoria({ ...cats[1], totalLancamentos: 1 })).toBe(
      "1 lançamento",
    );
  });

  it("recorrência e conta vinculada", () => {
    expect(
      resumoRecorrencia({
        diaVencimento: 5,
        categoria: { nome: "Moradia" },
        meioPagamento: { nome: "Pix" },
        pessoa: null,
      }),
    ).toBe("todo dia 5 · Moradia · Pix");
    expect(
      resumoConta({
        pessoa: null,
        meioPagamento: null,
        sincronizarDesde: "2026-10-25T00:00:00.000Z",
      }),
    ).toBe("sem titular · sem meio · desde 25/10/2026");
  });

  it("iniciais e tipo do meio", () => {
    expect(iniciais("Júnior Conquista Silva")).toBe("JS");
    expect(iniciais("Pix")).toBe("PI");
    expect(iniciais(" ")).toBe("?");
    expect(nomeTipoMeio("credito")).toBe("Crédito");
    expect(nomeTipoMeio(undefined)).toBe("Outro");
  });
});
