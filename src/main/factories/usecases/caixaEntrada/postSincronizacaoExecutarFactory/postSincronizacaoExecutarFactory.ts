import { PostSincronizacaoExecutar } from "@/data/usecases";
import type { PostSincronizacaoExecutarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostSincronizacaoExecutarFactory =
  (): PostSincronizacaoExecutarUseCase =>
    new PostSincronizacaoExecutar(
      makeApiUrl("/sincronizacao/executar"),
      makeAuthorizeHttpClient(),
    );
