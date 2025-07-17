import { PostPessoas } from "@/data/usecases";
import type { PostPessoasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostPessoasFactory = (): PostPessoasUseCase =>
  new PostPessoas(makeApiUrl("/pessoas"), makeAuthorizeHttpClient());
