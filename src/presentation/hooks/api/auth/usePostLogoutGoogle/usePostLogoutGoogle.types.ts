import { type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { PostLogoutGoogleModel } from "@/domain/usecases";

export type UsePostLogoutGoogle = Omit<
  UseMutationOptions<PostLogoutGoogleModel, AxiosError>,
  "mutationKey" | "mutationFn"
>;
