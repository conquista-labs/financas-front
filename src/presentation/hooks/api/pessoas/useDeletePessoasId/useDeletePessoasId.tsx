import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  DeletePessoasIdModel,
  DeletePessoasIdParams,
} from "@/domain/usecases";
import { makeDeletePessoasIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

import type { UseDeletePessoasIdOptions } from "./useDeletePessoasId.types";

export const useDeletePessoasId = (
  options?: UseDeletePessoasIdOptions,
): UseMutationResult<
  DeletePessoasIdModel,
  AxiosError,
  DeletePessoasIdParams
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const deletePessoasId = makeDeletePessoasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-pessoas"],
    mutationFn: (params: DeletePessoasIdParams) => {
      return deletePessoasId.delete(params);
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
