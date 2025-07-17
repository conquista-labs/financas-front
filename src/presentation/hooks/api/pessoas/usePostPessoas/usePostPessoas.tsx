import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@rarui-react/components/dist/Toast";

import { urlRouters } from "@/presentation/router/router.definitions";
import { makePostPessoasFactory } from "@/main/factories/usecases";
import type { PostPessoasRequest, PostPessoasModel } from "@/domain/usecases";
import type { UsePostPessoasOptions } from "./usePostPessoas.types";

export const usePostPessoas = (
  options?: UsePostPessoasOptions,
): UseMutationResult<PostPessoasModel, AxiosError, PostPessoasRequest> => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const postPessoas = makePostPessoasFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-pessoas"],
    mutationFn: (body: PostPessoasRequest) => postPessoas.post(body),
    onSuccess: () => {
      navigate(urlRouters.people);
      queryClient.invalidateQueries({ queryKey: ["get-Pessoas"] });
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
