import { PostDesejoReabrir } from "@/data/usecases";
import type { PostDesejoReabrirUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostDesejoReabrirFactory = (): PostDesejoReabrirUseCase =>
  new PostDesejoReabrir(
    makeApiUrl("/desejos/:id/reabrir"),
    makeAuthorizeHttpClient(),
  );
