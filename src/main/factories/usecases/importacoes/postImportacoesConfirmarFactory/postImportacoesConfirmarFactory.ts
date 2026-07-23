import { PostImportacoesConfirmar } from "@/data/usecases";
import type { PostImportacoesConfirmarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostImportacoesConfirmarFactory =
  (): PostImportacoesConfirmarUseCase =>
    new PostImportacoesConfirmar(
      makeApiUrl("/importacoes/confirmar"),
      makeAuthorizeHttpClient(),
    );
