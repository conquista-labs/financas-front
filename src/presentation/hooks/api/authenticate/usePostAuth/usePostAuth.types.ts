import type { PostLoginRequest, PostLoginModel } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostLoginOptions = Omit<
  UseMutationOptions<PostLoginModel, AxiosError, PostLoginRequest, unknown>,
  "mutationKey" | "mutationFn"
>;
