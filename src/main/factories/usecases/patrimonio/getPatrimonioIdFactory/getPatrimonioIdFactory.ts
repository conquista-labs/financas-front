import { GetPatrimonioId } from "@/data/usecases";
import type { GetPatrimonioIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetPatrimonioIdFactory = (): GetPatrimonioIdUseCase =>
  new GetPatrimonioId(
    makeApiUrl("/patrimonios/:id"),
    makeAuthorizeHttpClient(),
  );
