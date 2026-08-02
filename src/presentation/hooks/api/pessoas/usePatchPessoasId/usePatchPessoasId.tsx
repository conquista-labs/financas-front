import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PatchPessoasIdModel,
  PatchPessoasIdParams,
  PatchPessoasIdRequest,
} from "@/domain/usecases";
import { makePatchPessoasIdFactory } from "@/main/factories/usecases";

import type { UsePatchPessoasIdOptions } from "./usePatchPessoasId.types";

export const usePatchPessoasId = (
  params: PatchPessoasIdParams,
  options?: UsePatchPessoasIdOptions,
): UseMutationResult<
  PatchPessoasIdModel,
  AxiosError,
  PatchPessoasIdRequest
> => {
  const patchPessoasId = makePatchPessoasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-pessoas", params],
    mutationFn: (body: PatchPessoasIdRequest) => {
      return patchPessoasId.patch(body, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-pessoas"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
