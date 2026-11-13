import { PatchRecorrenciasId } from "@/data/usecases";
import type { PatchRecorrenciasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchRecorrenciasIdFactory = (): PatchRecorrenciasIdUseCase =>
  new PatchRecorrenciasId(
    makeApiUrl("/recorrencias/:id"),
    makeAuthorizeHttpClient(),
  );
