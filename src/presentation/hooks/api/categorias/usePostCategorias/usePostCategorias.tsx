import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePostCategoriasFactory } from "@/main/factories/usecases";
import type {
  PostCategoriasRequest,
  PostCategoriasModel,
} from "@/domain/usecases";
import type { UsePostCategoriasOptions } from "./usePostCategorias.types";

export const usePostCategorias = (
  options?: UsePostCategoriasOptions,
): UseMutationResult<
  PostCategoriasModel,
  AxiosError,
  PostCategoriasRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const postCategorias = makePostCategoriasFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-categorias"],
    mutationFn: (body: PostCategoriasRequest) => postCategorias.post(body),
    onSuccess: () => {
      navigate(urlRouters.categories);
      queryClient.invalidateQueries({ queryKey: ["get-categorias"] });
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
