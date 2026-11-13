import { GetRecorrencias } from "@/data/usecases";
import type { GetRecorrenciasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetRecorrenciasFactory = (): GetRecorrenciasUseCase =>
  new GetRecorrencias(makeApiUrl("/recorrencias"), makeAuthorizeHttpClient());
