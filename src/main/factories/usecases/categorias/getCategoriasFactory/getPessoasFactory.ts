import { GetCategorias } from "@/data/usecases";
import type { GetCategoriasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetCategoriasFactory = (): GetCategoriasUseCase =>
  new GetCategorias(makeApiUrl("/categorias"), makeAuthorizeHttpClient());
