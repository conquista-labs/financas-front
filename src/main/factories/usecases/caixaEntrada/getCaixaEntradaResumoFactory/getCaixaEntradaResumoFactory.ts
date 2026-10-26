import { GetCaixaEntradaResumo } from "@/data/usecases";
import type { GetCaixaEntradaResumoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCaixaEntradaResumoFactory =
  (): GetCaixaEntradaResumoUseCase =>
    new GetCaixaEntradaResumo(
      makeApiUrl("/caixa-entrada/resumo"),
      makeAuthorizeHttpClient(),
    );
