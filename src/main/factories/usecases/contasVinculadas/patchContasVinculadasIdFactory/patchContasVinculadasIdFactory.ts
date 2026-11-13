import { PatchContasVinculadasId } from "@/data/usecases";
import type { PatchContasVinculadasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchContasVinculadasIdFactory =
  (): PatchContasVinculadasIdUseCase =>
    new PatchContasVinculadasId(
      makeApiUrl("/contas-vinculadas/:id"),
      makeAuthorizeHttpClient(),
    );
