import { PatchCategoriasId } from "@/data/usecases";
import type { PatchCategoriasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePatchCategoriasIdFactory = (): PatchCategoriasIdUseCase =>
  new PatchCategoriasId(
    makeApiUrl("/categorias/:id"),
    makeAuthorizeHttpClient(),
  );
