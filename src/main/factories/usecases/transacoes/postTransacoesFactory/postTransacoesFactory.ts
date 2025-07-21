import { PostTransacoes } from "@/data/usecases";
import type { PostTransacoesUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostTransacoesFactory = (): PostTransacoesUseCase =>
  new PostTransacoes(makeApiUrl("/transacoes"), makeAuthorizeHttpClient());
