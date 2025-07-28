import { object, string } from "yup";

export const schema = object({
  categoriaId: string().optional(),
  pessoaId: string().optional(),
  meioPagamentoId: string().optional(),
  formaPagamento: string().optional(),
}).required();

export const defaultForm = {
  categoriaId: "",
  pessoaId: "",
  meioPagamentoId: "",
  formaPagamento: "",
  tipo: "",
};

export const buildOptions = (data: { id: string; nome: string }[]) =>
  data.map((line) => ({ label: line.nome, value: line.id }));

export const optionsTypes = [
  {
    label: "Despesa",
    value: "despesa",
  },
  {
    label: "Receita",
    value: "receita",
  },
];
