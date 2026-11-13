import { GetCaixaEntradaCandidatas } from "@/data/usecases";
import type { GetCaixaEntradaCandidatasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCaixaEntradaCandidatasFactory =
  (): GetCaixaEntradaCandidatasUseCase =>
    new GetCaixaEntradaCandidatas(
      makeApiUrl("/caixa-entrada/:id/candidatas"),
      makeAuthorizeHttpClient(),
    );
