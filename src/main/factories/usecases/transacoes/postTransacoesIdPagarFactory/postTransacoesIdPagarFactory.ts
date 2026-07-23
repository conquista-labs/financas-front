import { PostTransacoesIdPagar } from "@/data/usecases";
import type { PostTransacoesIdPagarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostTransacoesIdPagarFactory =
  (): PostTransacoesIdPagarUseCase =>
    new PostTransacoesIdPagar(
      makeApiUrl("/transacoes/:id/pagar"),
      makeAuthorizeHttpClient(),
    );
