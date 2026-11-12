import {
  dataPorExtenso,
  diasDasTransacoes,
  itensAtencao,
  percentualGuardado,
  saudacao,
  serieSaldoDoMes,
} from "./inicio.helpers";

const rotas = {
  revisar: "/revisar",
  agenda: "/agenda",
  ajustes: "/ajustes",
  metas: "/metas",
};
const vazio = {
  paraRevisar: 0,
  dicasDuplicidade: 0,
  contasProximas: { total: 0, valor: 0 },
  contasAtrasadas: { total: 0 },
  estouradas: [],
  metasAtingidas: [],
  rotas,
};

describe("saudacao e dataPorExtenso", () => {
  it("bom dia / boa tarde / boa noite", () => {
    expect(saudacao(new Date(2026, 10, 10, 8))).toBe("Bom dia");
    expect(saudacao(new Date(2026, 10, 10, 14))).toBe("Boa tarde");
    expect(saudacao(new Date(2026, 10, 10, 21))).toBe("Boa noite");
  });

  it("Terça, 10 de novembro (sem '-feira')", () => {
    expect(dataPorExtenso(new Date(2026, 10, 10))).toBe(
      "Terça, 10 de novembro",
    );
    expect(dataPorExtenso(new Date(2026, 10, 15))).toBe(
      "Domingo, 15 de novembro",
    );
  });
});

describe("percentualGuardado", () => {
  it("saldo sobre a renda, arredondado; null sem renda", () => {
    expect(percentualGuardado(3483, 12400)).toBe(28);
    expect(percentualGuardado(-200, 12400)).toBe(-2);
    expect(percentualGuardado(100, 0)).toBeNull();
    expect(percentualGuardado(undefined, 100)).toBeNull();
  });
});

describe("serieSaldoDoMes", () => {
  const dias = [
    { dia: 2, totalReceitas: 0, totalDespesas: 50 },
    { dia: 1, totalReceitas: 0, totalDespesas: 100 },
    { dia: 5, totalReceitas: 9800, totalDespesas: 0 },
    { dia: 30, totalReceitas: 0, totalDespesas: 2800 },
  ];

  it("acumula em ordem de dia", () => {
    const { pontos } = serieSaldoDoMes(dias, {
      ano: 2026,
      mes: 11,
      hoje: new Date(2026, 10, 12),
    });
    expect(pontos.map((p) => p.saldo)).toEqual([-100, -150, 9650, 6850]);
  });

  it("corte: hoje no mês atual, fim no passado, 0 no futuro", () => {
    const hoje = new Date(2026, 10, 12);
    expect(serieSaldoDoMes(dias, { ano: 2026, mes: 11, hoje }).corte).toBe(12);
    expect(serieSaldoDoMes(dias, { ano: 2026, mes: 10, hoje }).corte).toBe(30);
    expect(serieSaldoDoMes(dias, { ano: 2026, mes: 12, hoje }).corte).toBe(0);
    expect(serieSaldoDoMes(dias, { ano: 2025, mes: 12, hoje }).corte).toBe(30);
  });
});

describe("itensAtencao", () => {
  it("tudo em dia → nada", () => {
    expect(itensAtencao(vazio)).toEqual([]);
  });

  it("revisar com dicas de duplicidade", () => {
    const [item] = itensAtencao({
      ...vazio,
      paraRevisar: 30,
      dicasDuplicidade: 4,
    });
    expect(item).toMatchObject({
      marca: "30",
      titulo: "Para revisar",
      detalhe: "30 lançamentos do banco ou extrato · 4 dicas de duplicidade",
      href: "/revisar",
    });
  });

  it("contas: atrasada em destaque (vermelho), senão o total a pagar", () => {
    const [comAtraso] = itensAtencao({
      ...vazio,
      contasAtrasadas: {
        total: 1,
        primeira: { descricao: "Internet", valor: 119.9 },
      },
      contasProximas: { total: 2, valor: 340 },
    });
    expect(comAtraso.marca).toBe("3");
    expect(comAtraso.titulo).toBe("Contas nos próximos 7 dias");
    expect(comAtraso.detalhe).toMatch(
      /^Internet está atrasada · R\$\s?119,90$/,
    );
    expect(comAtraso.tom).toBe("danger");

    const [semAtraso] = itensAtencao({
      ...vazio,
      contasProximas: { total: 2, valor: 340 },
    });
    expect(semAtraso.detalhe).toMatch(/^R\$\s?340,00 a pagar$/);
    expect(semAtraso.tom).toBe("warning");
  });

  it("conta pelo total da API, não pelo tamanho da página", () => {
    const [soAtrasadas] = itensAtencao({
      ...vazio,
      contasAtrasadas: {
        total: 37,
        primeira: { descricao: "CEMIG", valor: 81.33 },
      },
    });
    expect(soAtrasadas.marca).toBe("37");
    expect(soAtrasadas.titulo).toBe("Contas atrasadas");
    expect(soAtrasadas.detalhe).toContain("+36 atrasadas");
  });

  it("teto: destaca a categoria mais estourada", () => {
    const [item] = itensAtencao({
      ...vazio,
      estouradas: [
        { nome: "Restaurantes", realizado: 980, orcado: 800 },
        { nome: "Mercado", realizado: 2140, orcado: 1800 },
      ],
    });
    expect(item.titulo).toBe("2 categorias passaram do teto");
    expect(item.detalhe).toMatch(/^Restaurantes: .* \(123%\)$/);
  });

  it("meta atingida e ordem dos itens", () => {
    const itens = itensAtencao({
      ...vazio,
      paraRevisar: 1,
      metasAtingidas: [{ titulo: "Reserva de emergência" }],
      estouradas: [{ nome: "Mercado", realizado: 2140, orcado: 1800 }],
      contasProximas: { total: 1, valor: 100 },
    });
    expect(itens.map((i) => i.id)).toEqual([
      "revisar",
      "contas",
      "teto",
      "meta",
    ]);
    expect(itens[3].titulo).toBe("Reserva de emergência chegou lá");
    expect(itens[0].detalhe).toBe("1 lançamento do banco ou extrato");
  });
});

describe("diasDasTransacoes", () => {
  it("soma por dia pelo tipo da categoria; fora do mês é ignorado", () => {
    const dias = diasDasTransacoes(
      [
        {
          data: "2026-11-05T12:00:00.000Z",
          valor: 9800,
          categoria: { tipo: "receita" },
        },
        {
          data: "2026-11-05T12:00:00.000Z",
          valor: 100,
          categoria: { tipo: "despesa" },
        },
        {
          data: "2026-11-30",
          valor: "R$ 2.800,00",
          categoria: { tipo: "despesa" },
        },
        { data: "2026-11-07", valor: 50, categoria: null },
        { data: "2026-11-31", valor: 1, categoria: { tipo: "despesa" } },
      ],
      30,
    );
    expect(dias).toHaveLength(30);
    expect(dias[4]).toEqual({
      dia: 5,
      totalReceitas: 9800,
      totalDespesas: 100,
    });
    expect(dias[6].totalDespesas).toBe(50);
    expect(dias[29].totalDespesas).toBe(2800);
  });
});
