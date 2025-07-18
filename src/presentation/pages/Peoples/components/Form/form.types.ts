import { Pessoa } from "@/domain/models";

export interface FormProps {
  defaultValues?: Partial<Pessoa>;
  onSubmit: any;
  isPending: boolean;
}
