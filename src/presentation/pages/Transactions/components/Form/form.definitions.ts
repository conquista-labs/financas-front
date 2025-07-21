import { number, object, string } from "yup";

export const schema = object({
  categoriaId: string().required("Categoria é obrigatória"),
  pessoaId: string().required("Pessoa é obrigatória"),
  meioPagamentoId: string().required("Meio de pagamento é obrigatório"),
  formaPagamento: string().optional(),
  data: string().required("Data é obrigatória"),
  descricao: string().required("Descrição é obrigatória"),
  valor: number().required("Valor é obrigatório"),
  observacoes: string().optional(),
}).required();

export const defaultForm = {
  categoriaId: "",
  pessoaId: "",
  meioPagamentoId: "",
  formaPagamento: "",
  data: new Date().toISOString(),
  descricao: "",
  valor: 0,
  observacoes: "",
};

export const buildOptions = (data: { id: string; nome: string }[]) =>
  data.map((line) => ({ label: line.nome, value: line.id }));
