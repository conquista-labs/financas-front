import { makeApiUrl } from "@/main/factories/http";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { PostLogoutGoogle } from "@/data/usecases";
import type { PostLogoutGoogleUseCase } from "@/domain/usecases";

export const makePostLogoutGoogleFactory = (): PostLogoutGoogleUseCase =>
  new PostLogoutGoogle(
    makeApiUrl("/auth/google/disconnect"),
    makeAuthorizeHttpClient(),
  );
