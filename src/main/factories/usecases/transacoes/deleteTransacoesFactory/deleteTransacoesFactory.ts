import { DeleteTransacoesId } from "@/data/usecases";
import type { DeleteTransacoesIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteTransacoesIdFactory = (): DeleteTransacoesIdUseCase =>
  new DeleteTransacoesId(
    makeApiUrl("/transacoes/:id"),
    makeAuthorizeHttpClient(),
  );
