import { PostCaixaEntradaVincular } from "@/data/usecases";
import type { PostCaixaEntradaVincularUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaVincularFactory =
  (): PostCaixaEntradaVincularUseCase =>
    new PostCaixaEntradaVincular(
      makeApiUrl("/caixa-entrada/vincular"),
      makeAuthorizeHttpClient(),
    );
