import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";
import { makeDeleteCategoriasIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

import type { UseDeleteCategoriasIdOptions } from "./useDeleteCategoriasId.types";

export const useDeleteCategoriasId = (
  options?: UseDeleteCategoriasIdOptions,
): UseMutationResult<
  DeleteCategoriasIdModel,
  AxiosError,
  DeleteCategoriasIdParams
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const deleteCategoriasId = makeDeleteCategoriasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-categorias"],
    mutationFn: (params: DeleteCategoriasIdParams) => {
      return deleteCategoriasId.delete(params);
    },
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
