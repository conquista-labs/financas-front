import { PostMetaReabrir } from "@/data/usecases";
import type { PostMetaReabrirUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMetaReabrirFactory = (): PostMetaReabrirUseCase =>
  new PostMetaReabrir(
    makeApiUrl("/metas/:id/reabrir"),
    makeAuthorizeHttpClient(),
  );
