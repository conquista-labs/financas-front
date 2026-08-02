import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PatchMeiosPagamentoIdModel,
  PatchMeiosPagamentoIdParams,
  PatchMeiosPagamentoIdRequest,
} from "@/domain/usecases";
import { makePatchMeiosPagamentoIdFactory } from "@/main/factories/usecases";

import type { UsePatchMeiosPagamentoIdOptions } from "./usePatchMeiosPagamentoId.types";

export const usePatchMeiosPagamentoId = (
  params: PatchMeiosPagamentoIdParams,
  options?: UsePatchMeiosPagamentoIdOptions,
): UseMutationResult<
  PatchMeiosPagamentoIdModel,
  AxiosError,
  PatchMeiosPagamentoIdRequest
> => {
  const patchMeiosPagamentoId = makePatchMeiosPagamentoIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-meios-pagamento", params],
    mutationFn: (body: PatchMeiosPagamentoIdRequest) => {
      return patchMeiosPagamentoId.patch(body, params);
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
