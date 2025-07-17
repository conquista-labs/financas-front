import { GetPessoasId } from "@/data/usecases";
import type { GetPessoasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetPessoasIdFactory = (): GetPessoasIdUseCase =>
  new GetPessoasId(makeApiUrl("/pessoas/:id"), makeAuthorizeHttpClient());
