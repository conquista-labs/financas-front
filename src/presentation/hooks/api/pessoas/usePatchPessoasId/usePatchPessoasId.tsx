import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePatchPessoasIdFactory } from "@/main/factories/usecases";
import type {
  PatchPessoasIdParams,
  PatchPessoasIdRequest,
  PatchPessoasIdModel,
} from "@/domain/usecases";
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
      navigate(urlRouters.peoples);
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
