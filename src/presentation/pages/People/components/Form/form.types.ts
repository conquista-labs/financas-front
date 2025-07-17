import type { GetPessoasIdModel } from "@/domain/usecases";

export interface FormProps {
  defaultValues?: GetPessoasIdModel;
  onSubmit: any;
  isPending: boolean;
}
