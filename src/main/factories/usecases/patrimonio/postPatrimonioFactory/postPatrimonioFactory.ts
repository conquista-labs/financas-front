import { PostPatrimonio } from "@/data/usecases";
import type { PostPatrimonioUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostPatrimonioFactory = (): PostPatrimonioUseCase =>
  new PostPatrimonio(makeApiUrl("/patrimonios"), makeAuthorizeHttpClient());
