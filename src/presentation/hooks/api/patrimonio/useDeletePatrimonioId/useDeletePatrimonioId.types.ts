import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { DeletePatrimonioIdParams } from "@/domain/usecases";

export type UseDeletePatrimonioIdOptions = Omit<
  UseMutationOptions<void, AxiosError, DeletePatrimonioIdParams, unknown>,
  "mutationKey" | "mutationFn"
>;
