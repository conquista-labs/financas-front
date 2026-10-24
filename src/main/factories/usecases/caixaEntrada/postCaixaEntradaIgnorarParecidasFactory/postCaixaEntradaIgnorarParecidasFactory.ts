import { PostCaixaEntradaIgnorarParecidas } from "@/data/usecases";
import type { PostCaixaEntradaIgnorarParecidasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaIgnorarParecidasFactory = (): PostCaixaEntradaIgnorarParecidasUseCase =>
  new PostCaixaEntradaIgnorarParecidas(makeApiUrl("/caixa-entrada/ignorar-parecidas"), makeAuthorizeHttpClient());
