import { useToast } from "@rarui-react/components/dist/Toast";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import type { PostPessoasModel, PostPessoasRequest } from "@/domain/usecases";
import { makePostPessoasFactory } from "@/main/factories/usecases";
import { urlRouters } from "@/presentation/router/router.definitions";

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
      navigate(urlRouters.registers);
      queryClient.invalidateQueries({ queryKey: ["get-pessoas"] });
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
