import { PostCaixaEntradaRestaurar } from "@/data/usecases";
import type { PostCaixaEntradaRestaurarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaRestaurarFactory =
  (): PostCaixaEntradaRestaurarUseCase =>
    new PostCaixaEntradaRestaurar(
      makeApiUrl("/caixa-entrada/restaurar"),
      makeAuthorizeHttpClient(),
    );
