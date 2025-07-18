import { PostCategorias } from "@/data/usecases";
import type { PostCategoriasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostCategoriasFactory = (): PostCategoriasUseCase =>
  new PostCategorias(makeApiUrl("/categorias"), makeAuthorizeHttpClient());
