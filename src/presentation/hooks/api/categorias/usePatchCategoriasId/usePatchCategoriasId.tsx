import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type {
  PatchCategoriasIdModel,
  PatchCategoriasIdParams,
  PatchCategoriasIdRequest,
} from "@/domain/usecases";
import { makePatchCategoriasIdFactory } from "@/main/factories/usecases";

import type { UsePatchCategoriasIdOptions } from "./usePatchCategoriasId.types";

export const usePatchCategoriasId = (
  params: PatchCategoriasIdParams,
  options?: UsePatchCategoriasIdOptions,
): UseMutationResult<
  PatchCategoriasIdModel,
  AxiosError,
  PatchCategoriasIdRequest
> => {
  const patchCategoriasId = makePatchCategoriasIdFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-Cctegorias", params],
    mutationFn: (body: PatchCategoriasIdRequest) => {
      return patchCategoriasId.patch(body, params);
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
