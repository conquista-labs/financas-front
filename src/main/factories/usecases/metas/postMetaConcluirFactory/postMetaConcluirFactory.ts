import { PostMetaConcluir } from "@/data/usecases";
import type { PostMetaConcluirUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makePostMetaConcluirFactory = (): PostMetaConcluirUseCase =>
  new PostMetaConcluir(
    makeApiUrl("/metas/:id/concluir"),
    makeAuthorizeHttpClient(),
  );
