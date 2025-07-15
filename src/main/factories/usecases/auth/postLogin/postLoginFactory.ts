import { PostLogin } from "@/data/usecases";
import type { PostLoginUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostLoginFactory = (): PostLoginUseCase =>
  new PostLogin(makeApiUrl("/auth/login"), makeAuthorizeHttpClient());
