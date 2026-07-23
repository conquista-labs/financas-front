import { array, boolean, object, string } from "yup";

/**
 * Schema de validação do formulário completo de transação. Reaproveita as
 * regras do form legado (pessoaId/meio obrigatórios evitam o bug de ID vazio
 * que quebra a API — ver memória rebrand-gaps-backend).
 */
export const schema = object({
  categoriaId: string().required("Categoria é obrigatória"),
  pessoaId: string().required("Pessoa é obrigatória"),
  meioPagamentoId: string().required("Meio de pagamento é obrigatório"),
  formaPagamento: string().optional(),
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
