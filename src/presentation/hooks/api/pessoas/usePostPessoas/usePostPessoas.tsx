import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import type { PostPessoasModel, PostPessoasRequest } from "@/domain/usecases";
import { makePostPessoasFactory } from "@/main/factories/usecases";

import type { UsePostPessoasOptions } from "./usePostPessoas.types";

export const usePostPessoas = (
  options?: UsePostPessoasOptions,
): UseMutationResult<PostPessoasModel, AxiosError, PostPessoasRequest> => {
  const postPessoas = makePostPessoasFactory();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-pessoas"],
    mutationFn: (body: PostPessoasRequest) => postPessoas.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-pessoas"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
};
