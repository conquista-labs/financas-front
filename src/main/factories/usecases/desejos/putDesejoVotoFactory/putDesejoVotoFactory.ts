import { PutDesejoVoto } from "@/data/usecases";
import type { PutDesejoVotoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePutDesejoVotoFactory = (): PutDesejoVotoUseCase =>
  new PutDesejoVoto(
    makeApiUrl("/desejos/:id/votos/:pessoaId"),
    makeAuthorizeHttpClient(),
  );
