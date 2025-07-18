import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePatchMeiosPagamentoIdFactory } from "@/main/factories/usecases";
import type {
  PatchMeiosPagamentoIdParams,
  PatchMeiosPagamentoIdRequest,
  PatchMeiosPagamentoIdModel,
} from "@/domain/usecases";
import type { UsePatchMeiosPagamentoIdOptions } from "./usePatchMeiosPagamentoId.types";

export const usePatchMeiosPagamentoId = (
  params: PatchMeiosPagamentoIdParams,
  options?: UsePatchMeiosPagamentoIdOptions,
): UseMutationResult<
  PatchMeiosPagamentoIdModel,
  AxiosError,
  PatchMeiosPagamentoIdRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const patchMeiosPagamentoId = makePatchMeiosPagamentoIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-meios-pagamento", params],
    mutationFn: (body: PatchMeiosPagamentoIdRequest) => {
      return patchMeiosPagamentoId.patch(body, params);
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
