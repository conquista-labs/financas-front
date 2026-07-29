import { PatchDesejoId } from "@/data/usecases";
import type { PatchDesejoIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchDesejoIdFactory = (): PatchDesejoIdUseCase =>
  new PatchDesejoId(makeApiUrl("/desejos/:id"), makeAuthorizeHttpClient());
