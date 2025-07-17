import { PatchPessoasId } from "@/data/usecases";
import type { PatchPessoasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchPessoasIdFactory = (): PatchPessoasIdUseCase =>
  new PatchPessoasId(makeApiUrl("/pessoas/:id"), makeAuthorizeHttpClient());
