import { PostCaixaEntradaIgnorar } from "@/data/usecases";
import type { PostCaixaEntradaIgnorarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaIgnorarFactory =
  (): PostCaixaEntradaIgnorarUseCase =>
    new PostCaixaEntradaIgnorar(
      makeApiUrl("/caixa-entrada/ignorar"),
      makeAuthorizeHttpClient(),
    );
