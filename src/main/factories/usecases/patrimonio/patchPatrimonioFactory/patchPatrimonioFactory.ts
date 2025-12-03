import { PatchPatrimonioId } from "@/data/usecases";
import type { PatchPatrimonioIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchPatrimonioFactory = (): PatchPatrimonioIdUseCase =>
  new PatchPatrimonioId(
    makeApiUrl("/patrimonios/:id"),
    makeAuthorizeHttpClient(),
  );
