import { object, string } from "yup";

export const schema = object({
  nome: string().required("Nome é obrigatório"),
}).required();

export const defaultForm = {
  nome: "",
};
