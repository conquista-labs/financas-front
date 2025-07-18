import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { useToast } from "@rarui-react/components/dist/Toast";
import { urlRouters } from "@/presentation/router/router.definitions";
import { makeDeleteMeiosPagamentoIdFactory } from "@/main/factories/usecases";

import type {
  DeleteMeiosPagamentoIdParams,
  DeleteMeiosPagamentoIdModel,
} from "@/domain/usecases";
import type { UseDeleteMeiosPagamentoIdOptions } from "./useDeleteMeiosPagamentoId.types";

export const useDeleteMeiosPagamentoId = (
  options?: UseDeleteMeiosPagamentoIdOptions,
): UseMutationResult<
  DeleteMeiosPagamentoIdModel,
  AxiosError,
  DeleteMeiosPagamentoIdParams
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const deleteMeiosPagamentoId = makeDeleteMeiosPagamentoIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-meios-pagamento"],
    mutationFn: (params: DeleteMeiosPagamentoIdParams) => {
      return deleteMeiosPagamentoId.delete(params);
    },
    onSuccess: () => {
      navigate(urlRouters.meansOfPayment);
      queryClient.invalidateQueries({ queryKey: ["get-meios-pagamento"] });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        appearance: "error",
        variant: "solid",
        duration: 4000,
      });
    },
    ...options,
  });
};
