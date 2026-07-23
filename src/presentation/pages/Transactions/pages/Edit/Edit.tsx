import { useParams } from "react-router-dom";

import {
  useGetTransacoesId,
  usePatchTransacoesId,
} from "@/presentation/hooks/api";

import {
  TransactionForm,
  type TransactionFormValues,
} from "../../components/TransactionForm";
import {
  fromTransacao,
  toRequest,
} from "../../components/TransactionForm/toRequest";

/** Tela de editar transação (form completo, nova identidade). */
const Edit = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useGetTransacoesId({ id: `${id}` });
  const { mutate, isPending } = usePatchTransacoesId({ id: `${id}` });

  const handleSubmit = (
    values: TransactionFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => mutate(toRequest(values), { onSuccess });

  if (isLoading) return null;

  return (
    <TransactionForm
      defaultValues={response?.data && fromTransacao(response.data)}
      isPending={isPending}
      onSubmit={handleSubmit}
      allowAddAnother={false}
    />
  );
};

export default Edit;
