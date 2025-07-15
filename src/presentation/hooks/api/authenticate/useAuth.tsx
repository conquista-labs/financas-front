import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { makePostLoginFactory } from "@/main/factories/usecases";

import type { PostLoginRequest } from "@/domain/usecases";
import type { UsePostLoginOptions } from "./useAuth.types";

export const useAuth = (
  options?: UsePostLoginOptions,
): UseMutationResult<
  { access_token: string },
  AxiosError,
  PostLoginRequest
> => {
  const postLogin = makePostLoginFactory();

  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: (body: PostLoginRequest) => postLogin.execute(body),
    ...options,
  });
};
