import type { PostResumoFinanceiroModel } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostResumoFinanceiroOptions = Omit<
  UseMutationOptions<PostResumoFinanceiroModel, AxiosError>,
  "mutationKey" | "mutationFn"
>;
