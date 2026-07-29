import { PostDesejoPromover } from "@/data/usecases";
import type { PostDesejoPromoverUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostDesejoPromoverFactory = (): PostDesejoPromoverUseCase =>
  new PostDesejoPromover(
    makeApiUrl("/desejos/:id/promover"),
    makeAuthorizeHttpClient(),
  );
