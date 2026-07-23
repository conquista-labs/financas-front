import { PostLoginWithGoogle } from "@/data/usecases";
import type { PostLoginWithGoogleUseCase } from "@/domain/usecases";
import { makeApiUrl } from "@/main/factories/http";
import { makeAxiosHttpClient } from "@/main/factories/http";

export const makePostLoginWithGoogleFactory = (): PostLoginWithGoogleUseCase =>
  new PostLoginWithGoogle(
    makeApiUrl("/auth/google-login"),
    makeAxiosHttpClient(),
  );
