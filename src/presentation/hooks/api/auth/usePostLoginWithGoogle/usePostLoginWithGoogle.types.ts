import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostLoginWithGoogleModel,
  PostLoginWithGoogleRequest,
} from "@/domain/usecases";

export type UsePostLoginWithGoogle = Omit<
  UseMutationOptions<
    PostLoginWithGoogleModel,
    AxiosError,
    PostLoginWithGoogleRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
