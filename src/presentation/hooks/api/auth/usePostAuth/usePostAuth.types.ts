import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { PostLoginModel, PostLoginRequest } from "@/domain/usecases";

export type UsePostLoginOptions = Omit<
  UseMutationOptions<PostLoginModel, AxiosError, PostLoginRequest, unknown>,
  "mutationKey" | "mutationFn"
>;
