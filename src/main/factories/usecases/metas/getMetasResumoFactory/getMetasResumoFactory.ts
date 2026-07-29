import { GetMetasResumo } from "@/data/usecases";
import type { GetMetasResumoUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetMetasResumoFactory = (): GetMetasResumoUseCase =>
  new GetMetasResumo(makeApiUrl("/metas/resumo"), makeAuthorizeHttpClient());
