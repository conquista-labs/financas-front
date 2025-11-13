import type { PostLogoutGoogleModel } from "@/domain/usecases";
import { type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type UsePostLogoutGoogle = Omit<
  UseMutationOptions<PostLogoutGoogleModel, AxiosError>,
  "mutationKey" | "mutationFn"
>;
