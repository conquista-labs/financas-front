import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  DeleteMeiosPagamentoIdModel,
  DeleteMeiosPagamentoIdParams,
} from "@/domain/usecases";
import { makeDeleteMeiosPagamentoIdFactory } from "@/main/factories/usecases";

import type { UseDeleteMeiosPagamentoIdOptions } from "./useDeleteMeiosPagamentoId.types";

export const useDeleteMeiosPagamentoId = (
  options?: UseDeleteMeiosPagamentoIdOptions,
): UseMutationResult<
  DeleteMeiosPagamentoIdModel,
  AxiosError,
  DeleteMeiosPagamentoIdParams
> => {
  const deleteMeiosPagamentoId = makeDeleteMeiosPagamentoIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-meios-pagamento"],
    mutationFn: (params: DeleteMeiosPagamentoIdParams) => {
      return deleteMeiosPagamentoId.delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-meios-pagamento"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
