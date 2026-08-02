import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type { DeletePatrimonioIdParams } from "@/domain/usecases";
import { makeDeletePatrimonioFactory } from "@/main/factories/usecases";

import type { UseDeletePatrimonioIdOptions } from "./useDeletePatrimonioId.types";

export const useDeletePatrimonioId = (
  options?: UseDeletePatrimonioIdOptions,
): UseMutationResult<void, AxiosError, DeletePatrimonioIdParams> => {
  const deletePatrimonio = makeDeletePatrimonioFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["delete-patrimonio"],
    mutationFn: (params: DeletePatrimonioIdParams) =>
      deletePatrimonio.delete(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patrimonios"] });
      queryClient.invalidateQueries({ queryKey: ["get-resumo-patrimonio"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
