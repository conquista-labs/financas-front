import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePatchCategoriasIdFactory } from "@/main/factories/usecases";
import type {
  PatchCategoriasIdParams,
  PatchCategoriasIdRequest,
  PatchCategoriasIdModel,
} from "@/domain/usecases";
import type { UsePatchCategoriasIdOptions } from "./usePatchCategoriasId.types";

export const usePatchCategoriasId = (
  params: PatchCategoriasIdParams,
  options?: UsePatchCategoriasIdOptions,
): UseMutationResult<
  PatchCategoriasIdModel,
  AxiosError,
  PatchCategoriasIdRequest
> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const patchCategoriasId = makePatchCategoriasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-Cctegorias", params],
    mutationFn: (body: PatchCategoriasIdRequest) => {
      return patchCategoriasId.patch(body, params);
    },
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
