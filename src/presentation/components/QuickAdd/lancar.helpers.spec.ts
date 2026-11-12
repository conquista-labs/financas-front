import {
  type CamposLancamento,
  montarEnvio,
  validar,
  valorPorParcela,
} from "./lancar.helpers";

const base: CamposLancamento = {
  tipo: "despesa",
  valor: 312.45,
  categoriaId: "cat-mercado",
  pessoaId: "",
  meioPagamentoId: "meio-nubank",
  data: "2026-12-15",
  descricao: "Mercado",
  repeticao: "unico",
  parcelas: 2,
  status: "pendente",
  tags: [],
  observacoes: "",
};
const hoje = new Date(2026, 10, 12); // 12/11/2026

describe("valorPorParcela", () => {
  it("divide o total pelas parcelas, em centavos", () => {
    expect(valorPorParcela(312.45, 3)).toBe(104.15);
    expect(valorPorParcela(100, 3)).toBe(33.33);
    expect(valorPorParcela(50, 1)).toBe(50);
  });
});

describe("validar", () => {
  it("exige valor e categoria", () => {
    expect(validar({ ...base, valor: 0 })).toBe("Informe um valor.");
    expect(validar({ ...base, categoriaId: "" })).toBe(
      "Escolha uma categoria.",
    );
    expect(validar(base)).toBeNull();
  });
});

describe("montarEnvio", () => {
  it("único: valor cheio, à vista, sem campos vazios", () => {
    const { transacao, recorrencia } = montarEnvio(base, { hoje });
    expect(recorrencia).toBeUndefined();
    expect(transacao).toEqual({
      descricao: "Mercado",
      categoriaId: "cat-mercado",
      valor: 312.45,
      data: new Date("2026-12-15T12:00:00").toISOString(),
      formaPagamento: "avista",
      status: "pendente",
      meioPagamentoId: "meio-nubank",
    });
  });

  it("parcelado: manda o valor de cada parcela (a API não divide)", () => {
    const { transacao } = montarEnvio(
      { ...base, repeticao: "parcelar", parcelas: 3 },
      { hoje },
    );
    expect(transacao).toMatchObject({
      valor: 104.15,
      formaPagamento: "parcela3x",
    });
  });

  it("tags e observações só quando preenchidas", () => {
    const { transacao } = montarEnvio(
      { ...base, tags: ["viagem"], observacoes: "  presente  " },
      { hoje },
    );
    expect(transacao).toMatchObject({
      tags: ["viagem"],
      observacoes: "presente",
    });
  });

  it("sem descrição usa o nome da categoria", () => {
    const { transacao } = montarEnvio(
      { ...base, descricao: " " },
      { hoje, nomeCategoria: "Supermercado" },
    );
    expect(transacao?.descricao).toBe("Supermercado");
  });

  describe("mensal", () => {
    it("data futura: só cria a recorrência (a API gera este mês)", () => {
      const env = montarEnvio(
        { ...base, repeticao: "mensal", data: "2026-11-20", pessoaId: "p-1" },
        { hoje },
      );
      expect(env.transacao).toBeUndefined();
      expect(env.recorrencia).toEqual({
        descricao: "Mercado",
        valor: 312.45,
        diaVencimento: 20,
        categoriaId: "cat-mercado",
        pessoaId: "p-1",
        meioPagamentoId: "meio-nubank",
      });
    });

    it("data que já passou: cria o lançamento deste mês + a recorrência", () => {
      const env = montarEnvio(
        { ...base, repeticao: "mensal", data: "2026-11-05", status: "paga" },
        { hoje },
      );
      expect(env.transacao).toMatchObject({
        status: "paga",
        formaPagamento: "avista",
      });
      expect(env.recorrencia?.diaVencimento).toBe(5);
    });
  });
});
