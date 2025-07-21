import { Transacao } from "@/domain/models";

export interface FormProps {
  defaultValues?: Partial<Transacao>;
  onSubmit: any;
  isPending: boolean;
}
