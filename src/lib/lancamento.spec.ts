import { interpretarLancamento, type OpcoesLancamento } from "./lancamento";

const opcoes: OpcoesLancamento = {
  hoje: new Date(2026, 10, 12), // 12/11/2026
  categorias: [
    { id: "c-mercado", nome: "Mercado", tipo: "despesa" },
    { id: "c-moradia", nome: "Moradia", tipo: "despesa" },
    { id: "c-transporte", nome: "Transporte", tipo: "despesa" },
    { id: "c-restaurantes", nome: "Restaurantes", tipo: "despesa" },
    { id: "c-farmacia", nome: "Farmácia", tipo: "despesa" },
    { id: "c-salario", nome: "Salário", tipo: "receita" },
  ],
  meios: [
    { id: "m-nubank-cred", nome: "Cartão Nubank", tipo: "credito" },
    { id: "m-nubank-deb", nome: "Débito Nubank", tipo: "debito" },
    { id: "m-itau", nome: "Cartão Itaú", tipo: "credito" },
    { id: "m-pix", nome: "Pix", tipo: "pix" },
  ],
  pessoas: [
    { id: "p-junior", nome: "Júnior" },
    { id: "p-mavi", nome: "Mavi" },
    { id: "p-casal", nome: "Casal" },
  ],
};

const interpretar = (frase: string) => interpretarLancamento(frase, opcoes);

describe("interpretarLancamento", () => {
  it("entende o exemplo do protótipo: mercado 312,45 nubank 3x", () => {
    expect(interpretar("mercado 312,45 nubank 3x")).toEqual({
      valor: 312.45,
      parcelas: 3,
      tipo: "despesa",
      categoriaId: "c-mercado",
      meioPagamentoId: "m-nubank-cred",
      descricao: "Mercado",
    });
  });

  it("aceita os campos em qualquer ordem", () => {
    const r = interpretar("3x nubank 312,45 mercado");
    expect(r).toMatchObject({
      valor: 312.45,
      parcelas: 3,
      categoriaId: "c-mercado",
    });
  });

  describe("valor", () => {
    it.each([
      ["uber 45", 45],
      ["mercado 312,45", 312.45],
      ["tv 3.000", 3000],
      ["tv 1.234,56", 1234.56],
      ["lanche 45.90", 45.9],
      ["aluguel R$ 2800", 2800],
      ["aluguel r$2800", 2800],
    ])("%s → %d", (frase, valor) => {
      expect(interpretar(frase).valor).toBe(valor);
    });

    it("não confunde parcelas ou data com valor", () => {
      expect(interpretar("tv 10x 3000").valor).toBe(3000);
      expect(interpretar("mercado 05/11 120").valor).toBe(120);
    });
  });

  describe("parcelas", () => {
    it("limita a 12x (máximo do enum da API)", () => {
      expect(interpretar("tv 3000 18x").parcelas).toBe(12);
    });

    it("1x não é parcelado", () => {
      expect(interpretar("tv 3000 1x").parcelas).toBeUndefined();
    });
  });

  describe("meio de pagamento", () => {
    it("prefere o cartão de crédito quando o banco casa mais de um meio", () => {
      expect(interpretar("mercado 50 nubank").meioPagamentoId).toBe(
        "m-nubank-cred",
      );
    });

    it("usa o débito quando a frase diz débito", () => {
      const r = interpretar("mercado 50 nubank débito");
      expect(r.meioPagamentoId).toBe("m-nubank-deb");
      expect(r.descricao).toBe("Mercado");
    });

    it("casa com acento ou sem: itau/itaú", () => {
      expect(interpretar("mercado 50 itau").meioPagamentoId).toBe("m-itau");
    });

    it("pix", () => {
      expect(interpretar("uber 45 pix").meioPagamentoId).toBe("m-pix");
    });
  });

  describe("categoria e tipo", () => {
    it("usa sinônimos do dia a dia (uber → Transporte)", () => {
      expect(interpretar("uber 45").categoriaId).toBe("c-transporte");
    });

    it("ifood cai em Restaurantes quando não há Delivery", () => {
      expect(interpretar("ifood 80").categoriaId).toBe("c-restaurantes");
    });

    it("casa sem acento e no plural (farmacia, restaurante)", () => {
      expect(interpretar("farmacia 30").categoriaId).toBe("c-farmacia");
      expect(interpretar("restaurante 90").categoriaId).toBe("c-restaurantes");
    });

    it("salário vira receita", () => {
      expect(interpretar("salário 9800")).toMatchObject({
        valor: 9800,
        tipo: "receita",
        categoriaId: "c-salario",
      });
    });

    it("recebi sem categoria conhecida também é receita", () => {
      const r = interpretar("recebi 500 do freela");
      expect(r.tipo).toBe("receita");
      expect(r.categoriaId).toBeUndefined();
    });
  });

  describe("pessoa, data e situação", () => {
    it("reconhece a pessoa pelo nome, sem acento", () => {
      expect(interpretar("farmacia 30 junior").pessoaId).toBe("p-junior");
    });

    it("hoje, ontem e dd/mm", () => {
      expect(interpretar("uber 45 ontem").data).toBe("2026-11-11");
      expect(interpretar("uber 45 hoje").data).toBe("2026-11-12");
      expect(interpretar("uber 45 05/11").data).toBe("2026-11-05");
    });

    it("ignora data impossível", () => {
      expect(interpretar("uber 45 31/02").data).toBeUndefined();
    });

    it("pago / pendente", () => {
      expect(interpretar("luz 248 pago").status).toBe("paga");
      expect(interpretar("luz 248 pendente").status).toBe("pendente");
    });
  });

  describe("descrição", () => {
    it("fica com as palavras que não viraram campo", () => {
      expect(interpretar("padaria pão quente 32,50 pix").descricao).toBe(
        "Padaria pão quente",
      );
    });

    it("tira conectivos soltos nas pontas", () => {
      expect(interpretar("almoço no shopping 60 no nubank").descricao).toBe(
        "Almoço no shopping",
      );
    });

    it("frase vazia não quebra", () => {
      expect(interpretar("   ")).toEqual({ descricao: "" });
    });
  });
});

describe("interpretarLancamento com os nomes do banco de dev", () => {
  const real: OpcoesLancamento = {
    hoje: new Date(2026, 10, 12),
    categorias: [
      { id: "supermercado", nome: "Supermercado", tipo: "despesa" },
      { id: "padaria", nome: "Padaria", tipo: "despesa" },
      { id: "restaurante", nome: "Restaurante", tipo: "despesa" },
      { id: "fastfood", nome: "Fast Food", tipo: "despesa" },
      { id: "tjetta", nome: "Transporte (Jetta)", tipo: "despesa" },
      { id: "tmoto", nome: "Transporte (Moto)", tipo: "despesa" },
      { id: "casa", nome: "Casa", tipo: "despesa" },
      { id: "saude", nome: "Saúde", tipo: "despesa" },
      {
        id: "fech-desp",
        nome: "Fechamento de Caixa (Despesa)",
        tipo: "despesa",
      },
      { id: "aluguel", nome: "Aluguel", tipo: "receita" },
      { id: "salario", nome: "Salário", tipo: "receita" },
    ],
    meios: [
      { id: "pix", nome: "Pix", tipo: "pix" },
      { id: "xp-deb", nome: "XP - Cartão de Débito", tipo: "debito" },
      { id: "xp-cred", nome: "XP - Cartão de Crédito", tipo: "credito" },
      { id: "nu-deb", nome: "Nubank - Cartão de Débito", tipo: "debito" },
      { id: "nu-cred", nome: "Nubank - Cartão de Crédito", tipo: "credito" },
      { id: "caixa-cred", nome: "Caixa - Cartão de Crédito", tipo: "credito" },
      { id: "deb-auto", nome: "Débito Automático", tipo: "debito" },
    ],
    pessoas: [
      { id: "casal", nome: "Casal" },
      { id: "junior", nome: "Júnior" },
      { id: "maria-helena", nome: "Maria Helena" },
      { id: "vo-nina", nome: "Vó Nina" },
    ],
  };
  const r = (frase: string) => interpretarLancamento(frase, real);

  it("mercado → Supermercado (sinônimo)", () => {
    expect(r("mercado 312,45 nubank 3x")).toMatchObject({
      categoriaId: "supermercado",
      meioPagamentoId: "nu-cred",
      parcelas: 3,
      descricao: "Mercado",
    });
  });

  it("banco de 2 letras: xp", () => {
    expect(r("padaria 20 xp").meioPagamentoId).toBe("xp-cred");
    expect(r("padaria 20 xp débito").meioPagamentoId).toBe("xp-deb");
  });

  it('"débito" sozinho não escolhe um meio qualquer', () => {
    expect(r("padaria 20 débito").meioPagamentoId).toBeUndefined();
  });

  it("caixa é o banco, não a categoria Fechamento de Caixa", () => {
    const x = r("casa 150 caixa");
    expect(x.meioPagamentoId).toBe("caixa-cred");
    expect(x.categoriaId).toBe("casa");
  });

  it("não chuta quando a palavra casa várias categorias (uber → Transporte de qual carro?)", () => {
    expect(r("uber 45").categoriaId).toBeUndefined();
    expect(r("transporte 45").categoriaId).toBeUndefined();
  });

  it("favorita desempata", () => {
    const comFavorita = {
      ...real,
      categorias: real.categorias.map((c) =>
        c.id === "tjetta" ? { ...c, favorito: true } : c,
      ),
    };
    expect(interpretarLancamento("uber 45", comFavorita).categoriaId).toBe(
      "tjetta",
    );
  });

  it("ifood → Restaurante; lanche → Fast Food", () => {
    expect(r("ifood 80").categoriaId).toBe("restaurante");
    expect(r("lanche 35").categoriaId).toBe("fastfood");
  });

  it("aluguel é receita neste banco", () => {
    expect(r("aluguel 2800")).toMatchObject({
      categoriaId: "aluguel",
      tipo: "receita",
    });
  });

  it("pessoa com nome composto e com acento", () => {
    expect(r("farmácia 30 helena").pessoaId).toBe("maria-helena");
    expect(r("farmácia 30 nina").pessoaId).toBe("vo-nina");
  });
});
