import { DeletePessoasId } from "@/data/usecases";
import type { DeletePessoasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeletePessoasIdFactory = (): DeletePessoasIdUseCase =>
  new DeletePessoasId(makeApiUrl("/pessoas/:id"), makeAuthorizeHttpClient());
