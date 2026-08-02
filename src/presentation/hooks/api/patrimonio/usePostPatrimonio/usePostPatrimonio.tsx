import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PostPatrimonioRequest } from "@/domain/usecases";
import { makePostPatrimonioFactory } from "@/main/factories/usecases";

import type { UsePostPatrimonioOptions } from "./usePostPatrimonio.types";

export const usePostPatrimonio = (options?: UsePostPatrimonioOptions) => {
  const postPatrimonio = makePostPatrimonioFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["post-patrimonio"],
    mutationFn: (body: PostPatrimonioRequest) => postPatrimonio.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patrimonios"] });
      queryClient.invalidateQueries({ queryKey: ["get-resumo-patrimonio"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
