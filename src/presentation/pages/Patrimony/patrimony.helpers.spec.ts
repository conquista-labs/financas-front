import { describe, expect, it } from "vitest";

import type { Patrimonio } from "@/domain/models";

import {
  emptyForm,
  toRequest,
} from "./components/PatrimonyFormDialog/patrimonyForm.definitions";
import { linhasDaLista, valorDivida } from "./patrimony.helpers";

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
    expect(linhasDaLista([emprestimo, lote, finCasa, casa]).map((r) => r.id)).toEqual(
      ["casa", "lote", "emp"],
    );
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
    const base = { ...emptyForm, saldoDevedor: "10,00", dataAquisicao: "2024-01-01" };
    expect(toRequest({ ...base, tipo: "passivo" }).bemId).toBe("");
    expect(
      "bemId" in toRequest({ ...base, tipo: "ativo", valorAtual: "1,00" }),
    ).toBe(false);
  });
});
