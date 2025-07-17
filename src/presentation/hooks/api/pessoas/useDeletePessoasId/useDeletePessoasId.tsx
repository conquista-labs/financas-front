import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { useToast } from "@rarui-react/components/dist/Toast";
import { urlRouters } from "@/presentation/router/router.definitions";
import { makeDeletePessoasIdFactory } from "@/main/factories/usecases";

import type {
  DeletePessoasIdParams,
  DeletePessoasIdModel,
} from "@/domain/usecases";
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
      navigate(urlRouters.people);
      queryClient.invalidateQueries({ queryKey: ["get-Pessoas"] });
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
