import { boolean, object, string } from "yup";

export const schema = object({
  email: string().email("E-mail inválido"),
  nome: string().required("Nome é obrigatório"),
  ativo: boolean().required("Status é obrigatório"),
}).required();

export const defaultForm = {
  email: "",
  nome: "",
  ativo: true,
};
