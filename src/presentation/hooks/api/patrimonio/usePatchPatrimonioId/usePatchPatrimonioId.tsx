import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  PatchPatrimonioIdParams,
  PatchPatrimonioIdRequest,
} from "@/domain/usecases";
import { makePatchPatrimonioFactory } from "@/main/factories/usecases";

import type { UsePatchPatrimonioIdOptions } from "./usePatchPatrimonioId.types";

export const usePatchPatrimonioId = (
  params: PatchPatrimonioIdParams,
  options?: UsePatchPatrimonioIdOptions,
) => {
  const patchPatrimonio = makePatchPatrimonioFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["patch-patrimonio"],
    mutationFn: (body: PatchPatrimonioIdRequest) =>
      patchPatrimonio.patch(params, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patrimonios"] });
      queryClient.invalidateQueries({ queryKey: ["get-patrimonio"] });
      queryClient.invalidateQueries({ queryKey: ["get-resumo-patrimonio"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
