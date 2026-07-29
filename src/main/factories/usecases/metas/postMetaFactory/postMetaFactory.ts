import { PostMeta } from "@/data/usecases";
import type { PostMetaUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMetaFactory = (): PostMetaUseCase =>
  new PostMeta(makeApiUrl("/metas"), makeAuthorizeHttpClient());
