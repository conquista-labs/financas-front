import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { PostLoginModel, PostLoginRequest } from "@/domain/usecases";
import { makePostLoginFactory } from "@/main/factories/usecases";

import type { UsePostLoginOptions } from "./usePostAuth.types";

export const usePostAuth = (
  options?: UsePostLoginOptions,
): UseMutationResult<PostLoginModel, AxiosError, PostLoginRequest> => {
  const postLogin = makePostLoginFactory();

  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: (body: PostLoginRequest) => postLogin.execute(body),
    ...options,
  });
};
