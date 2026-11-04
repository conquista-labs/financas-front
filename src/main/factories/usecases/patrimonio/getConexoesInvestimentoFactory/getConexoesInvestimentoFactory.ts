import { GetConexoesInvestimento } from "@/data/usecases";
import type { GetConexoesInvestimentoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetConexoesInvestimentoFactory =
  (): GetConexoesInvestimentoUseCase =>
    new GetConexoesInvestimento(
      makeApiUrl("/sincronizacao/investimentos"),
      makeAuthorizeHttpClient(),
    );
