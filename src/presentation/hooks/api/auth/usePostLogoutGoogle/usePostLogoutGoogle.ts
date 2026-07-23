import { useMutation } from "@tanstack/react-query";

import { makePostLogoutGoogleFactory } from "@/main/factories/usecases";

import type { UsePostLogoutGoogle } from "./usePostLogoutGoogle.types";

export const usePostLogoutGoogle = (options?: UsePostLogoutGoogle) => {
  const logoutGoogle = makePostLogoutGoogleFactory();

  return useMutation({
    mutationKey: ["post-logout"],
    mutationFn: () => logoutGoogle.excute(),
    ...options,
  });
};
