import { GetCategoriasId } from "@/data/usecases";
import type { GetCategoriasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCategoriasIdFactory = (): GetCategoriasIdUseCase =>
  new GetCategoriasId(makeApiUrl("/categorias/:id"), makeAuthorizeHttpClient());
