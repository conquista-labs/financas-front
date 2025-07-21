import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { makePostLoginFactory } from "@/main/factories/usecases";

import type { PostLoginRequest, PostLoginModel } from "@/domain/usecases";
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
