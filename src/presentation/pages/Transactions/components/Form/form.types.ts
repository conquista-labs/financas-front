import { Transacao } from "@/domain/models";

export interface FormProps {
  defaultValues?: Partial<Omit<Transacao, "valor">>;
  onSubmit: any;
  isPending: boolean;
}
