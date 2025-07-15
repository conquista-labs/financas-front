import type { PostLoginRequest } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostLoginOptions = Omit<
  UseMutationOptions<
    { access_token: string },
    AxiosError,
    PostLoginRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
