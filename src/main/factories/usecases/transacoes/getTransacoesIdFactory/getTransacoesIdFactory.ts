import { GetTransacoesId } from "@/data/usecases";
import type { GetTransacoesIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetTransacoesIdFactory = (): GetTransacoesIdUseCase =>
  new GetTransacoesId(makeApiUrl("/transacoes/:id"), makeAuthorizeHttpClient());
