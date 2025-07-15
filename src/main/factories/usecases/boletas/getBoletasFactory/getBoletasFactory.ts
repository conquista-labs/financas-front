import { GetBoletas } from "@/data/usecases";
import type { GetBoletasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeBoletasFactory = (): GetBoletasUseCase =>
  new GetBoletas(makeApiUrl("/v1/boletas"), makeAuthorizeHttpClient());
