import type {
  PostLoginWithGoogleModel,
  PostLoginWithGoogleRequest,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostLoginWithGoogle = Omit<
  UseMutationOptions<
    PostLoginWithGoogleModel,
    AxiosError,
    PostLoginWithGoogleRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
