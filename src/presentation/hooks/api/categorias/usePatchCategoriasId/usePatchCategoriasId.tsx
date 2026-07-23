import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type {
  PatchCategoriasIdModel,
  PatchCategoriasIdParams,
  PatchCategoriasIdRequest,
} from "@/domain/usecases";
import { makePatchCategoriasIdFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

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
