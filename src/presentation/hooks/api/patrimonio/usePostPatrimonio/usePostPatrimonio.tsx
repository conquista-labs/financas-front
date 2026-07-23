import { useToast } from "@rarui-react/components/dist/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { PostPatrimonioRequest } from "@/domain/usecases";
import { makePostPatrimonioFactory } from "@/main/factories/usecases";

import type { UsePostPatrimonioOptions } from "./usePostPatrimonio.types";

export const usePostPatrimonio = (options?: UsePostPatrimonioOptions) => {
  const { addToast } = useToast();

  const postPatrimonio = makePostPatrimonioFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["post-patrimonio"],
    mutationFn: (body: PostPatrimonioRequest) => postPatrimonio.post(body),
    onSuccess: () => {
      console.log("Patrimônio criado com sucesso", options);
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
