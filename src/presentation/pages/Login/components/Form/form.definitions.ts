import { object, string } from "yup";

export const schema = object().shape({
  email: string().required("E-mail é obrigatório").email("E-mail inválido"),
  password: string().required("Senha é obrigatória"),
});

export const defaultValues = {
  email: "",
  password: "",
};
