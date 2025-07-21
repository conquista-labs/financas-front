import { GetTransacoes } from "@/data/usecases";
import type { GetTransacoesUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetTransacoesFactory = (): GetTransacoesUseCase =>
  new GetTransacoes(makeApiUrl("/transacoes"), makeAuthorizeHttpClient());
