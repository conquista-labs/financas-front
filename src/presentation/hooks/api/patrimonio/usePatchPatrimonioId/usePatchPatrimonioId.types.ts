import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PatchPatrimonioIdModel,
  PatchPatrimonioIdRequest,
} from "@/domain/usecases";

export type UsePatchPatrimonioIdOptions = Omit<
  UseMutationOptions<
    PatchPatrimonioIdModel,
    AxiosError,
    PatchPatrimonioIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
