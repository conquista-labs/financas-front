import { DeleteMetaId } from "@/data/usecases";
import type { DeleteMetaIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteMetaIdFactory = (): DeleteMetaIdUseCase =>
  new DeleteMetaId(makeApiUrl("/metas/:id"), makeAuthorizeHttpClient());
