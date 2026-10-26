import { PostDesejoRealizar } from "@/data/usecases";
import type { PostDesejoRealizarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostDesejoRealizarFactory = (): PostDesejoRealizarUseCase =>
  new PostDesejoRealizar(
    makeApiUrl("/desejos/:id/realizar"),
    makeAuthorizeHttpClient(),
  );
