import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  PatchPessoasIdModel,
  PatchPessoasIdParams,
  PatchPessoasIdRequest,
} from "@/domain/usecases";
import { makePatchPessoasIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

import type { UsePatchPessoasIdOptions } from "./usePatchPessoasId.types";

export const usePatchPessoasId = (
  params: PatchPessoasIdParams,
  options?: UsePatchPessoasIdOptions,
): UseMutationResult<
  PatchPessoasIdModel,
  AxiosError,
  PatchPessoasIdRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const patchPessoasId = makePatchPessoasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-pessoas", params],
    mutationFn: (body: PatchPessoasIdRequest) => {
      return patchPessoasId.patch(body, params);
    },
    onSuccess: () => {
      navigate(urlRouters.registers);
      queryClient.invalidateQueries({ queryKey: ["get-pessoas"] });
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
