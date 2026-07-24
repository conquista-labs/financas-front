import { PatchTagsId } from "@/data/usecases";
import type { PatchTagsIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchTagsFactory = (): PatchTagsIdUseCase =>
  new PatchTagsId(makeApiUrl("/tags/:id"), makeAuthorizeHttpClient());
