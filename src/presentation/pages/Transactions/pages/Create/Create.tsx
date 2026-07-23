import { usePostTransacoes } from "@/presentation/hooks/api";

import {
  TransactionForm,
  type TransactionFormValues,
} from "../../components/TransactionForm";
import { toRequest } from "../../components/TransactionForm/toRequest";

/** Tela de criar transação (form completo, nova identidade). */
const Create = () => {
  const { mutate, isPending } = usePostTransacoes();

  const handleSubmit = (
    values: TransactionFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => mutate(toRequest(values), { onSuccess });

  return (
    <TransactionForm
      isPending={isPending}
      onSubmit={handleSubmit}
      allowAddAnother
    />
  );
};

export default Create;
