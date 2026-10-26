import { PostCaixaEntradaAceitar } from "@/data/usecases";
import type { PostCaixaEntradaAceitarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaAceitarFactory =
  (): PostCaixaEntradaAceitarUseCase =>
    new PostCaixaEntradaAceitar(
      makeApiUrl("/caixa-entrada/aceitar"),
      makeAuthorizeHttpClient(),
    );
