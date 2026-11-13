import { GetContasVinculadas } from "@/data/usecases";
import type { GetContasVinculadasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetContasVinculadasFactory = (): GetContasVinculadasUseCase =>
  new GetContasVinculadas(
    makeApiUrl("/contas-vinculadas"),
    makeAuthorizeHttpClient(),
  );
