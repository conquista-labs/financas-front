import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";
import { makeDeleteCategoriasIdFactory } from "@/main/factories/usecases";

import type { UseDeleteCategoriasIdOptions } from "./useDeleteCategoriasId.types";

export const useDeleteCategoriasId = (
  options?: UseDeleteCategoriasIdOptions,
): UseMutationResult<
  DeleteCategoriasIdModel,
  AxiosError,
  DeleteCategoriasIdParams
> => {
  const deleteCategoriasId = makeDeleteCategoriasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-categorias"],
    mutationFn: (params: DeleteCategoriasIdParams) => {
      return deleteCategoriasId.delete(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-categorias"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
