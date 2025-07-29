import { Categoria } from "@/domain/models";

export interface FormProps {
  defaultValues?: Omit<Categoria, "tetoGasto">;
  onSubmit: any;
  isPending: boolean;
}
