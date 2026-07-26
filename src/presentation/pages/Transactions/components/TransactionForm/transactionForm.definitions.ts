import { array, boolean, object, string } from "yup";

/**
 * Schema de validação do formulário completo de transação. Só categoria,
 * data, descrição e valor são obrigatórios — como no backend
 * (EditTransacaoRequest.required = []; no create só categoria/valor/data/
 * descrição). Pessoa e meio ficam opcionais: transações importadas vêm sem
 * eles e precisam ser editáveis. O `toRequest` omite IDs vazios (spread
 * condicional), então não recai no antigo bug de "ID vazio → 500".
 */
export const schema = object({
  categoriaId: string().required("Categoria é obrigatória"),
  pessoaId: string().nullable().optional(),
  meioPagamentoId: string().nullable().optional(),
  formaPagamento: string().nullable().optional(),
  data: string().required("Data é obrigatória"),
  descricao: string().required("Descrição é obrigatória"),
  valor: string().required("Valor é obrigatório"),
  observacoes: string().optional(),
  lembrarMe: boolean().optional(),
  /** "paga" (já paga) ou "pendente" (a pagar / conta futura). */
  status: string().optional(),
  tags: array(string().required()).optional(),
}).required();

export const defaultForm = {
  categoriaId: "",
  pessoaId: "",
  meioPagamentoId: "",
  formaPagamento: "",
  data: new Date().toISOString().slice(0, 10),
  descricao: "",
  valor: "",
  observacoes: "",
  lembrarMe: false,
  status: "paga",
  tags: [] as string[],
};

/**
 * Meios que costumam ser pagos DEPOIS (boleto, cheque, cartão de crédito) →
 * default "a pagar" (pendente). Os demais (Pix, dinheiro, débito) → "paga".
 * Heurística por nome; o usuário pode sempre trocar no toggle.
 */
export const statusPadraoPorMeio = (nomeMeio?: string): "paga" | "pendente" => {
  const n = (nomeMeio ?? "").toLowerCase();
  if (n.includes("boleto") || n.includes("cheque") || n.includes("crédito"))
    return "pendente";
  return "paga";
};
