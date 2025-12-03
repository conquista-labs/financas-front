import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";

import { makeDeletePatrimonioFactory } from "@/main/factories/usecases";
import type { DeletePatrimonioIdParams } from "@/domain/usecases";
import type { UseDeletePatrimonioIdOptions } from "./useDeletePatrimonioId.types";

export const useDeletePatrimonioId = (
  options?: UseDeletePatrimonioIdOptions,
): UseMutationResult<void, AxiosError, DeletePatrimonioIdParams> => {
  const { addToast } = useToast();

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
      addToast({
        title: error.message,
        appearance: "error",
        variant: "solid",
        duration: 4000,
      });
    },
  });
};
