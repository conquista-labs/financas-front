import type { DeletePatrimonioIdParams } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UseDeletePatrimonioIdOptions = Omit<
  UseMutationOptions<void, AxiosError, DeletePatrimonioIdParams, unknown>,
  "mutationKey" | "mutationFn"
>;
