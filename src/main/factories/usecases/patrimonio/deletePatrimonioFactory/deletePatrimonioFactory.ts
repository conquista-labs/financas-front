import { DeletePatrimonioId } from "@/data/usecases";
import type { DeletePatrimonioIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeletePatrimonioFactory = (): DeletePatrimonioIdUseCase =>
  new DeletePatrimonioId(
    makeApiUrl("/patrimonios/:id"),
    makeAuthorizeHttpClient(),
  );
