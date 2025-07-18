import { DeleteCategoriasId } from "@/data/usecases";
import type { DeleteCategoriasIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteCategoriasIdFactory = (): DeleteCategoriasIdUseCase =>
  new DeleteCategoriasId(
    makeApiUrl("/categorias/:id"),
    makeAuthorizeHttpClient(),
  );
