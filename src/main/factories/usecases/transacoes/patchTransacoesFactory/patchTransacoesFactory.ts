import { PatchTransacoesId } from "@/data/usecases";
import type { PatchTransacoesIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchTransacoesIdFactory = (): PatchTransacoesIdUseCase =>
  new PatchTransacoesId(
    makeApiUrl("/transacoes/:id"),
    makeAuthorizeHttpClient(),
  );
