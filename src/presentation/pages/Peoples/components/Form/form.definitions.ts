import { boolean, object, string } from "yup";

export const schema = object({
  email: string().email("E-mail inválido").optional(),
  nome: string().required("Nome é obrigatório"),
  ativo: boolean().required("Status é obrigatório").optional(),
}).required();

export const defaultForm = {
  email: "",
  nome: "",
  ativo: true,
};
