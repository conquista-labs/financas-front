import { PostCaixaEntradaExcluir } from "@/data/usecases";
import type { PostCaixaEntradaExcluirUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaExcluirFactory = (): PostCaixaEntradaExcluirUseCase =>
  new PostCaixaEntradaExcluir(makeApiUrl("/caixa-entrada/excluir"), makeAuthorizeHttpClient());
