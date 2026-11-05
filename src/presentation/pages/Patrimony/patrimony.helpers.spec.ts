import { describe, expect, it } from "vitest";

import type { Patrimonio } from "@/domain/models";

import {
  emptyForm,
  novoItem,
  toRequest,
} from "./components/PatrimonyFormDialog/patrimonyForm.definitions";
import {
  linhasDaLista,
  mostraVariacao,
  resumoPorGrupo,
  valorDivida,
} from "./patrimony.helpers";

const item = (over: Partial<Patrimonio>): Patrimonio =>
  ({
    id: "x",
    descricao: "x",
    tipo: "ativo",
    tipoFormatado: "Ativo",
    categoria: "imovel",
    categoriaFormatada: "Imóvel",
    valorAtual: 0,
    dataAquisicao: "2024-01-01",
    createdAt: "",
    updatedAt: "",
    ...over,
  }) as Patrimonio;

describe("linhasDaLista", () => {
  const casa = item({ id: "casa", valorAtual: 800000 });
  const finCasa = item({
    id: "fin",
    tipo: "passivo",
    categoria: "financiamento",
    valorAtual: 800000,
    saldoDevedor: 180000,
    bemId: "casa",
  });
  const lote = item({ id: "lote", valorAtual: 70000 });
  const emprestimo = item({
    id: "emp",
    tipo: "passivo",
    valorAtual: 10000,
    saldoDevedor: 9000,
  });

  it("o financiamento ligado não aparece sozinho; bens antes, dívidas soltas depois", () => {
    expect(
      linhasDaLista([emprestimo, lote, finCasa, casa]).map((r) => r.id),
    ).toEqual(["casa", "lote", "emp"]);
  });

  it("financiamento cujo bem não veio na lista aparece como dívida solta", () => {
    expect(linhasDaLista([finCasa]).map((r) => r.id)).toEqual(["fin"]);
  });

  it("a dívida é o saldo devedor, não o valor atual", () => {
    expect(valorDivida(finCasa)).toBe(180000);
    expect(valorDivida(item({ tipo: "passivo", valorAtual: 500 }))).toBe(500);
  });
});

describe("toRequest (formulário → API)", () => {
  it("passivo: valor = saldo devedor, taxa com vírgula e o bem ligado", () => {
    const body = toRequest({
      ...emptyForm,
      tipo: "passivo",
      categoria: "financiamento",
      descricao: "Financiamento da casa",
      valorAtual: "800.000,00",
      saldoDevedor: "180.000,00",
      taxaJuros: "0,99",
      dataAquisicao: "2025-06-20",
      bemId: "casa",
    });
    expect(body.valorAtual).toBe(180000);
    expect(body.saldoDevedor).toBe(180000);
    expect(body.taxaJuros).toBe(0.99);
    expect(body.bemId).toBe("casa");
  });

  it('passivo sem bem manda "" (desliga); ativo nem manda o campo', () => {
    const base = {
      ...emptyForm,
      saldoDevedor: "10,00",
      dataAquisicao: "2024-01-01",
    };
    expect(toRequest({ ...base, tipo: "passivo" }).bemId).toBe("");
    expect(
      "bemId" in toRequest({ ...base, tipo: "ativo", valorAtual: "1,00" }),
    ).toBe(false);
  });
});

describe("resumoPorGrupo (abas)", () => {
  const casa = item({ id: "casa", valorAtual: 800000 });
  const finCasa = item({
    id: "fin",
    tipo: "passivo",
    categoria: "financiamento",
    valorAtual: 180000,
    saldoDevedor: 180000,
    bemId: "casa",
  });
  const carro = item({ id: "carro", categoria: "veiculo", valorAtual: 60000 });
  const xp = item({ id: "xp", categoria: "investimento", valorAtual: 0 });
  const fgts = item({
    id: "fgts",
    categoria: "outros_ativos",
    valorAtual: 40000,
  });
  const caixinha = item({
    id: "cx",
    categoria: "disponivel",
    valorAtual: 1000,
  });

  it("separa por grupo; o financiamento entra no grupo do bem e desconta o líquido", () => {
    const grupos = resumoPorGrupo([finCasa, casa, carro, xp, fgts, caixinha]);
    expect(grupos.map((g) => g.grupo)).toEqual([
      "imoveis",
      "veiculos",
      "reservas",
    ]);
    expect(grupos[0]).toMatchObject({
      valor: 800000,
      divida: 180000,
      liquido: 620000,
    });
    expect(grupos[0].linhas.map((r) => r.id)).toEqual(["casa"]);
    expect(grupos[2].linhas.map((r) => r.id)).toEqual(["fgts", "cx", "xp"]);
    expect(grupos[2].liquido).toBe(41000);
  });

  it("dívida solta tem grupo próprio, e grupo vazio não aparece", () => {
    const emp = item({
      id: "emp",
      tipo: "passivo",
      categoria: "emprestimo",
      saldoDevedor: 9000,
    });
    const grupos = resumoPorGrupo([emp]);
    expect(grupos).toHaveLength(1);
    expect(grupos[0]).toMatchObject({
      grupo: "dividas",
      valor: 0,
      divida: 9000,
      liquido: -9000,
    });
  });

  it("financiamento de veículo vai para Veículos", () => {
    const finCarro = item({
      id: "fc",
      tipo: "passivo",
      saldoDevedor: 20000,
      bemId: "carro",
    });
    const [veiculos] = resumoPorGrupo([carro, finCarro]);
    expect(veiculos).toMatchObject({
      grupo: "veiculos",
      divida: 20000,
      liquido: 40000,
    });
  });
});

describe("novoItem (criar a partir da aba)", () => {
  it("vem na categoria da aba, com o tipo certo", () => {
    expect(novoItem("veiculo")).toMatchObject({
      categoria: "veiculo",
      tipo: "ativo",
    });
    expect(novoItem("divida")).toMatchObject({
      categoria: "divida",
      tipo: "passivo",
    });
    expect(novoItem("")).toBe(emptyForm);
  });
});

describe('mostraVariacao ("desde a compra")', () => {
  it("mostra quando valorizou ou desvalorizou", () => {
    expect(
      mostraVariacao(item({ valorAtual: 80000, valorInicial: 55000 })),
    ).toBe(true);
    expect(
      mostraVariacao(item({ valorAtual: 67174, valorInicial: 71800 })),
    ).toBe(true);
  });

  it("esconde sem diferença, zerado (vendido), sem valor de compra ou pela corretora", () => {
    expect(
      mostraVariacao(item({ valorAtual: 72000, valorInicial: 72000 })),
    ).toBe(false);
    expect(mostraVariacao(item({ valorAtual: 0, valorInicial: 71800 }))).toBe(
      false,
    );
    expect(mostraVariacao(item({ valorAtual: 1000 }))).toBe(false);
    expect(
      mostraVariacao(
        item({ valorAtual: 100, valorInicial: 50, pluggyItemId: "x" }),
      ),
    ).toBe(false);
  });
});
