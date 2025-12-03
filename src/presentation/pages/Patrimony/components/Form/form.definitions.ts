import { date, number, object, string } from "yup";

// Schema de validação Yup
export const schema = object({
  tipo: string().required("Tipo é obrigatório"),
  categoria: string().required("Categoria é obrigatória"),
  descricao: string()
    .required("Descrição é obrigatória")
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres"),
  valorAtual: string().required("Valor atual é obrigatório"),
  valorInicial: string().optional().nullable(),
  dataAquisicao: date().required("Data de aquisição é obrigatória"),
  observacoes: string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional(),
  // Campos de passivo
  saldoDevedor: string()
    .when("tipo", {
      is: "passivo",
      then: (schema) =>
        schema.required("Saldo devedor é obrigatório para passivos"),
      otherwise: (schema) => schema.optional(),
    })
    .nullable(),
  taxaJuros: number()
    .min(0, "Taxa de juros não pode ser negativa")
    .max(100, "Taxa de juros não pode ser maior que 100%")
    .optional()
    .nullable(),
  dataVencimento: date()
    .when("tipo", {
      is: "passivo",
      then: (schema) =>
        schema.test(
          "data-futura",
          "Data de vencimento deve ser futura",
          (value) => {
            if (!value) return true;
            return new Date(value) > new Date();
          },
        ),
    })
    .optional()
    .nullable(),
  pessoaId: string().optional(),
}).required();

// Valores padrão do formulário
export const defaultForm = {
  tipo: "",
  categoria: "",
  descricao: "",
  valorAtual: "",
  valorInicial: "",
  dataAquisicao: new Date(),
  observacoes: "",
  saldoDevedor: "",
  taxaJuros: undefined,
  dataVencimento: undefined,
  pessoaId: "",
};

// Helper para construir opções de pessoas
export const buildPessoasOptions = (data: { id: string; nome: string }[]) =>
  data.map((pessoa) => ({ label: pessoa.nome, value: pessoa.id }));
