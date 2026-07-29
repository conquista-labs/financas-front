import { PatchMetaId } from "@/data/usecases";
import type { PatchMetaIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchMetaIdFactory = (): PatchMetaIdUseCase =>
  new PatchMetaId(makeApiUrl("/metas/:id"), makeAuthorizeHttpClient());
