import { PostCaixaEntradaDesvincular } from "@/data/usecases";
import type { PostCaixaEntradaDesvincularUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaDesvincularFactory = (): PostCaixaEntradaDesvincularUseCase =>
  new PostCaixaEntradaDesvincular(makeApiUrl("/caixa-entrada/desvincular"), makeAuthorizeHttpClient());
