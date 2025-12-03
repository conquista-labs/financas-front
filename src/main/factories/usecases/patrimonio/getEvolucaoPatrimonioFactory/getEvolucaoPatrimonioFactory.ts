import { GetEvolucaoPatrimonio } from "@/data/usecases";
import type { GetEvolucaoPatrimonioUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetEvolucaoPatrimonioFactory =
  (): GetEvolucaoPatrimonioUseCase =>
    new GetEvolucaoPatrimonio(
      makeApiUrl("/patrimonios/evolucao"),
      makeAuthorizeHttpClient(),
    );
