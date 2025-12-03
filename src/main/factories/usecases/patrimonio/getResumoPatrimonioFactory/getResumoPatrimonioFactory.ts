import { GetResumoPatrimonio } from "@/data/usecases";
import type { GetResumoPatrimonioUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetResumoPatrimonioFactory = (): GetResumoPatrimonioUseCase =>
  new GetResumoPatrimonio(
    makeApiUrl("/patrimonios/resumo"),
    makeAuthorizeHttpClient(),
  );
