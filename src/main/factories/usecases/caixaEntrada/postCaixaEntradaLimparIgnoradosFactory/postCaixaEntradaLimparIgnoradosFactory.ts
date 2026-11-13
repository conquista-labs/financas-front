import { PostCaixaEntradaLimparIgnorados } from "@/data/usecases";
import type { PostCaixaEntradaLimparIgnoradosUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCaixaEntradaLimparIgnoradosFactory =
  (): PostCaixaEntradaLimparIgnoradosUseCase =>
    new PostCaixaEntradaLimparIgnorados(
      makeApiUrl("/caixa-entrada/limpar-ignorados"),
      makeAuthorizeHttpClient(),
    );
