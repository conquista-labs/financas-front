import type {
  PostPatrimonioRequest,
  PostPatrimonioModel,
} from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostPatrimonioOptions = Omit<
  UseMutationOptions<
    PostPatrimonioModel,
    AxiosError,
    PostPatrimonioRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
