import { PostRecorrencias } from "@/data/usecases";
import type { PostRecorrenciasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostRecorrenciasFactory = (): PostRecorrenciasUseCase =>
  new PostRecorrencias(makeApiUrl("/recorrencias"), makeAuthorizeHttpClient());
