import { DeleteDesejoId } from "@/data/usecases";
import type { DeleteDesejoIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteDesejoIdFactory = (): DeleteDesejoIdUseCase =>
  new DeleteDesejoId(makeApiUrl("/desejos/:id"), makeAuthorizeHttpClient());
