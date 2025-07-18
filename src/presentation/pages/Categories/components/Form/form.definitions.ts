import { Categoria } from "@/domain/models";
import { object, string } from "yup";

export const schema = object({
  nome: string().required("Nome é obrigatório"),
  cor: string().required("Cor é obrigatório"),
  tipo: string().required("Tipo é obrigatório"),
}).required();

export const defaultForm = {
  nome: "",
  tipo: "",
  cor: "#10d66fff",
};

export const tipoCategoriaOptions: {
  label: string;
  value: Categoria.TipoEnum;
}[] = [
  { label: "Despesa", value: Categoria.TipoEnum.Despesa },
  { label: "Receita", value: Categoria.TipoEnum.Receita },
];
