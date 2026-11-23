import {
  dataPorExtenso,
  escalaDoSaldo,
  itensAtencao,
  percentualGuardado,
  saudacao,
  serieSaldoDoAno,
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

describe("serieSaldoDoAno", () => {
  const meses = [
    { valor: 1000, receita: 5000, despesa: 4000 },
    { valor: 700, receita: 3000, despesa: 3300 },
    { valor: 1200.5, receita: 2000.5, despesa: 1500 },
  ];

  it("usa o saldo do fim de cada mês e quanto mudou no mês", () => {
    const { pontos } = serieSaldoDoAno(meses, {
      ano: 2026,
      hoje: new Date(2026, 1, 10),
    });
    expect(pontos).toEqual([
      { mes: 1, saldo: 1000, delta: 1000 },
      { mes: 2, saldo: 700, delta: -300 },
      { mes: 3, saldo: 1200.5, delta: 500.5 },
    ]);
  });

  it("corte: mês de hoje no ano atual, 12 no passado, 0 no futuro", () => {
    const hoje = new Date(2026, 10, 23);
    expect(serieSaldoDoAno(meses, { ano: 2026, hoje }).corte).toBe(11);
    expect(serieSaldoDoAno(meses, { ano: 2025, hoje }).corte).toBe(12);
    expect(serieSaldoDoAno(meses, { ano: 2027, hoje }).corte).toBe(0);
  });
});

describe("escalaDoSaldo", () => {
  // Saldos reais de 2026: janeiro bem acima dos outros meses.
  const ano = [
    48699, 23548, 11101, 3588, 1823, 3027, 3421, 6222, 297, 3930, 2393, 5450,
  ];

  it("menor valor na base, maior no topo, ordem preservada", () => {
    const y = escalaDoSaldo(ano);
    expect(y(297)).toBe(0);
    expect(y(48699)).toBe(1);
    expect(y(3588)).toBeGreaterThan(y(1823));
    expect(y(6222)).toBeGreaterThan(y(5450));
  });

  it("um mês muito alto não achata os outros", () => {
    const y = escalaDoSaldo(ano);
    // De abril a dezembro (R$ 297 a R$ 6.222) ocupa boa parte da altura;
    // numa escala linear seriam ~12%.
    expect(y(6222) - y(297)).toBeGreaterThan(0.4);
  });

  it("com negativos o zero fica dentro da faixa; série constante no meio", () => {
    const y = escalaDoSaldo([-2000, 500, 8000]);
    expect(y(0)).toBeGreaterThan(0);
    expect(y(0)).toBeLessThan(1);
    expect(escalaDoSaldo([100, 100])(100)).toBe(0.5);
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
