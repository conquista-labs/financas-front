import { PostLogoutGoogle } from "@/data/usecases";
import type { PostLogoutGoogleUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostLogoutGoogleFactory = (): PostLogoutGoogleUseCase =>
  new PostLogoutGoogle(
    makeApiUrl("/auth/google/disconnect"),
    makeAuthorizeHttpClient(),
  );
