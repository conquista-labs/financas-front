import { useMutation } from "@tanstack/react-query";

import type { PostLoginWithGoogleRequest } from "@/domain/usecases";
import { makePostLoginWithGoogleFactory } from "@/main/factories/usecases";

import type { UsePostLoginWithGoogle } from "./usePostLoginWithGoogle.types";

export const usePostLoginWithGoogle = (options?: UsePostLoginWithGoogle) => {
  const loginWithGoogle = makePostLoginWithGoogleFactory();

  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: (body: PostLoginWithGoogleRequest) =>
      loginWithGoogle.excute(body),
    ...options,
  });
};
