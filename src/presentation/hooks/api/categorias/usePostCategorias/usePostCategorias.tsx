import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PostCategoriasModel,
  PostCategoriasRequest,
} from "@/domain/usecases";
import { makePostCategoriasFactory } from "@/main/factories/usecases";

import type { UsePostCategoriasOptions } from "./usePostCategorias.types";

export const usePostCategorias = (
  options?: UsePostCategoriasOptions,
): UseMutationResult<
  PostCategoriasModel,
  AxiosError,
  PostCategoriasRequest
> => {
  const postCategorias = makePostCategoriasFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-categorias"],
    mutationFn: (body: PostCategoriasRequest) => postCategorias.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-categorias"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
