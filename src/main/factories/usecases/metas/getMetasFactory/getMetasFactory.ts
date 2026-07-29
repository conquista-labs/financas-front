import { GetMetas } from "@/data/usecases";
import type { GetMetasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetMetasFactory = (): GetMetasUseCase =>
  new GetMetas(makeApiUrl("/metas"), makeAuthorizeHttpClient());
