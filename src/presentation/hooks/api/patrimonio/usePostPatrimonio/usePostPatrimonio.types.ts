import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  PostPatrimonioModel,
  PostPatrimonioRequest,
} from "@/domain/usecases";

export type UsePostPatrimonioOptions = Omit<
  UseMutationOptions<
    PostPatrimonioModel,
    AxiosError,
    PostPatrimonioRequest,
    unknown
  >,
  "mutationKey" | "mutationFn"
>;
