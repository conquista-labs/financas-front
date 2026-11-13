import { DeleteRecorrenciasId } from "@/data/usecases";
import type { DeleteRecorrenciasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteRecorrenciasIdFactory =
  (): DeleteRecorrenciasIdUseCase =>
    new DeleteRecorrenciasId(
      makeApiUrl("/recorrencias/:id"),
      makeAuthorizeHttpClient(),
    );
