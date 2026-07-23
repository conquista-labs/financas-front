import { PostImportacoesAnalisar } from "@/data/usecases";
import type { PostImportacoesAnalisarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostImportacoesAnalisarFactory =
  (): PostImportacoesAnalisarUseCase =>
    new PostImportacoesAnalisar(
      makeApiUrl("/importacoes/analisar"),
      makeAuthorizeHttpClient(),
    );
