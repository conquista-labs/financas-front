import { object, string } from "yup";

import type {
  CreatePatrimonioRequest,
  EditPatrimonioRequest,
  Patrimonio,
} from "@/domain/models";
import { parseAmount } from "@/lib/format";

/** Valores do formulário (todos string p/ inputs; convertidos no submit). */
export interface PatrimonyFormValues {
  tipo: string;
  categoria: string;
  descricao: string;
  valorAtual: string;
  valorInicial: string;
  dataAquisicao: string;
  pessoaId: string;
  saldoDevedor: string;
  taxaJuros: string;
  dataVencimento: string;
  observacoes: string;
  /** Passivo: o bem que ele financia ("" = nenhum). */
  bemId: string;
}

export const emptyForm: PatrimonyFormValues = {
  tipo: "ativo",
  categoria: "",
  descricao: "",
  valorAtual: "",
  valorInicial: "",
  dataAquisicao: "",
  pessoaId: "",
  saldoDevedor: "",
  taxaJuros: "",
  dataVencimento: "",
  observacoes: "",
  bemId: "",
};

const CATEGORIAS_PASSIVO = new Set([
  "financiamento",
  "emprestimo",
  "divida",
  "outros_passivos",
]);

/** Form vazio de um item novo, já na categoria (e no tipo) da aba aberta. */
export const novoItem = (categoria?: string): PatrimonyFormValues =>
  categoria
    ? {
        ...emptyForm,
        categoria,
        tipo: CATEGORIAS_PASSIVO.has(categoria) ? "passivo" : "ativo",
      }
    : emptyForm;

export const schema = object({
  tipo: string().required("Selecione o tipo"),
  categoria: string().required("Selecione a categoria"),
  descricao: string()
    .required("Informe a descrição")
    .min(3, "Mínimo de 3 caracteres")
    .max(100, "Máximo de 100 caracteres"),
  // Passivo não tem "valor atual": a dívida é o saldo devedor.
  valorAtual: string().when("tipo", {
    is: "ativo",
    then: (s) => s.required("Informe o valor atual"),
    otherwise: (s) => s.optional(),
  }),
  valorInicial: string().optional(),
  dataAquisicao: string().required("Informe a data de aquisição"),
  pessoaId: string().optional(),
  saldoDevedor: string().when("tipo", {
    is: "passivo",
    then: (s) => s.required("Informe o saldo devedor"),
    otherwise: (s) => s.optional(),
  }),
  taxaJuros: string().optional(),
  dataVencimento: string().optional(),
  observacoes: string().max(500, "Máximo de 500 caracteres").optional(),
});

/** Pré-preenche o form a partir de um patrimônio existente (edição). */
export const fromPatrimonio = (p: Patrimonio): PatrimonyFormValues => ({
  tipo: p.tipo,
  categoria: p.categoria,
  descricao: p.descricao,
  valorAtual: String(p.valorAtual ?? ""),
  valorInicial: p.valorInicial != null ? String(p.valorInicial) : "",
  dataAquisicao: (p.dataAquisicao ?? "").slice(0, 10),
  pessoaId: p.pessoaId ?? "",
  saldoDevedor: p.saldoDevedor != null ? String(p.saldoDevedor) : "",
  taxaJuros: p.taxaJuros != null ? String(p.taxaJuros) : "",
  dataVencimento: (p.dataVencimento ?? "").slice(0, 10),
  observacoes: p.observacoes ?? "",
  bemId: p.bemId ?? "",
});

/**
 * Converte os valores do form no payload da API. Valores monetários vêm como
 * string ("1.000,00") e viram number; campos vazios/opcionais são omitidos.
 * O mesmo shape serve para create e edit.
 */
export const toRequest = (
  v: PatrimonyFormValues,
): CreatePatrimonioRequest & EditPatrimonioRequest => {
  const isPassivo = v.tipo === "passivo";
  return {
    descricao: v.descricao,
    tipo: v.tipo as CreatePatrimonioRequest.TipoEnum,
    categoria: v.categoria as CreatePatrimonioRequest.CategoriaEnum,
    // Passivo: o valor é o próprio saldo devedor (o que os totais usam).
    valorAtual: parseAmount(isPassivo ? v.saldoDevedor : v.valorAtual),
    dataAquisicao: v.dataAquisicao,
    ...(v.valorInicial ? { valorInicial: parseAmount(v.valorInicial) } : {}),
    ...(v.pessoaId ? { pessoaId: v.pessoaId } : {}),
    ...(v.observacoes ? { observacoes: v.observacoes } : {}),
    ...(isPassivo && v.saldoDevedor
      ? { saldoDevedor: parseAmount(v.saldoDevedor) }
      : {}),
    ...(isPassivo && v.taxaJuros
      ? { taxaJuros: Number(v.taxaJuros.replace(",", ".")) }
      : {}),
    // "" desliga o bem (a API grava null).
    ...(isPassivo ? { bemId: v.bemId ?? "" } : {}),
    ...(isPassivo && v.dataVencimento
      ? { dataVencimento: v.dataVencimento }
      : {}),
  };
};
