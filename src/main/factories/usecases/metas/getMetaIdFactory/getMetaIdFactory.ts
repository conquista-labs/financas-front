import { GetMetaId } from "@/data/usecases";
import type { GetMetaIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetMetaIdFactory = (): GetMetaIdUseCase =>
  new GetMetaId(makeApiUrl("/metas/:id"), makeAuthorizeHttpClient());
