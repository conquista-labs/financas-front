import { GetPessoaResponse } from "@/domain/models";

export interface FormProps {
  defaultValues?: Partial<GetPessoaResponse>;
  onSubmit: any;
  isPending: boolean;
}
