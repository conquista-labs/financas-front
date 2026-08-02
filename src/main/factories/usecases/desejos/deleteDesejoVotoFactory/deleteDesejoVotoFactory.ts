import { DeleteDesejoVoto } from "@/data/usecases";
import type { DeleteDesejoVotoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteDesejoVotoFactory = (): DeleteDesejoVotoUseCase =>
  new DeleteDesejoVoto(
    makeApiUrl("/desejos/:id/votos/:pessoaId"),
    makeAuthorizeHttpClient(),
  );
