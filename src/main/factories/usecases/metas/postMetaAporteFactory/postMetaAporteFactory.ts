import { PostMetaAporte } from "@/data/usecases";
import type { PostMetaAporteUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMetaAporteFactory = (): PostMetaAporteUseCase =>
  new PostMetaAporte(
    makeApiUrl("/metas/:id/aportes"),
    makeAuthorizeHttpClient(),
  );
