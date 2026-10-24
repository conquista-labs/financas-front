import { GetCaixaEntrada } from "@/data/usecases";
import type { GetCaixaEntradaUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCaixaEntradaFactory = (): GetCaixaEntradaUseCase =>
  new GetCaixaEntrada(makeApiUrl("/caixa-entrada"), makeAuthorizeHttpClient());
