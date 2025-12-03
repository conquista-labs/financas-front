import type {
  PatchPatrimonioIdRequest,
  PatchPatrimonioIdModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePatchPatrimonioIdOptions = Omit<
  UseMutationOptions<
    PatchPatrimonioIdModel,
    AxiosError,
    PatchPatrimonioIdRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
