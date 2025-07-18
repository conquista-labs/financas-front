import { MeioPagamento } from "@/domain/models";

export interface FormProps {
  defaultValues?: MeioPagamento;
  onSubmit: any;
  isPending: boolean;
}
