import { Categoria } from "@/domain/models";

export interface FormProps {
  defaultValues?: Categoria;
  onSubmit: any;
  isPending: boolean;
}
