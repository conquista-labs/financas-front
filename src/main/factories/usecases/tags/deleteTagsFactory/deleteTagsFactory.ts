import { DeleteTagsId } from "@/data/usecases";
import type { DeleteTagsIdUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeDeleteTagsFactory = (): DeleteTagsIdUseCase =>
  new DeleteTagsId(makeApiUrl("/tags/:id"), makeAuthorizeHttpClient());
