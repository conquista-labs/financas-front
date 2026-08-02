import { PostMetaRestaurar } from "@/data/usecases";
import type { PostMetaRestaurarUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMetaRestaurarFactory = (): PostMetaRestaurarUseCase =>
  new PostMetaRestaurar(
    makeApiUrl("/metas/:id/restaurar"),
    makeAuthorizeHttpClient(),
  );
