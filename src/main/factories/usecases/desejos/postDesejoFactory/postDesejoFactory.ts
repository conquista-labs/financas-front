import { PostDesejo } from "@/data/usecases";
import type { PostDesejoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostDesejoFactory = (): PostDesejoUseCase =>
  new PostDesejo(makeApiUrl("/desejos"), makeAuthorizeHttpClient());
