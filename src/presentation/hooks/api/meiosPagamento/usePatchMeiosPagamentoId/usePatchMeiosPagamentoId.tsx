import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  PatchMeiosPagamentoIdModel,
  PatchMeiosPagamentoIdParams,
  PatchMeiosPagamentoIdRequest,
} from "@/domain/usecases";
import { makePatchMeiosPagamentoIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

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
      navigate(urlRouters.registers);
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
