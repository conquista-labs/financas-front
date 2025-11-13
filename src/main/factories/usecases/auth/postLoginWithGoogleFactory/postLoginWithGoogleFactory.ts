import { makeApiUrl } from "@/main/factories/http";
import { makeAxiosHttpClient } from "@/main/factories/http";
import { PostLoginWithGoogle } from "@/data/usecases";
import type { PostLoginWithGoogleUseCase } from "@/domain/usecases";

export const makePostLoginWithGoogleFactory = (): PostLoginWithGoogleUseCase =>
  new PostLoginWithGoogle(
    makeApiUrl("/auth/google-login"),
    makeAxiosHttpClient(),
  );
