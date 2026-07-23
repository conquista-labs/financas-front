import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  PostCategoriasModel,
  PostCategoriasRequest,
} from "@/domain/usecases";
import { makePostCategoriasFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

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
      navigate(urlRouters.registers);
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
