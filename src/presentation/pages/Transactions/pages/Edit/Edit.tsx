import { useParams } from "react-router-dom";

import { Skeleton } from "@/presentation/components/ui";
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

  if (isLoading)
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-[34px] w-[220px] rounded-[10px]" />
        <Skeleton className="h-[480px] rounded-card" />
      </div>
    );

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
