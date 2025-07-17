import { GetPessoas } from "@/data/usecases";
import type { GetPessoasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetPessoasFactory = (): GetPessoasUseCase =>
  new GetPessoas(makeApiUrl("/pessoas"), makeAuthorizeHttpClient());
