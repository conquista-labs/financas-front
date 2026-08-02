import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  DeletePessoasIdModel,
  DeletePessoasIdParams,
} from "@/domain/usecases";
import { makeDeletePessoasIdFactory } from "@/main/factories/usecases";

import type { UseDeletePessoasIdOptions } from "./useDeletePessoasId.types";

export const useDeletePessoasId = (
  options?: UseDeletePessoasIdOptions,
): UseMutationResult<
  DeletePessoasIdModel,
  AxiosError,
  DeletePessoasIdParams
> => {
  const deletePessoasId = makeDeletePessoasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-pessoas"],
    mutationFn: (params: DeletePessoasIdParams) => {
      return deletePessoasId.delete(params);
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
