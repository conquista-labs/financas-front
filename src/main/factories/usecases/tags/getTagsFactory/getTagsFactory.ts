import { GetTags } from "@/data/usecases";
import type { GetTagsUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetTagsFactory = (): GetTagsUseCase =>
  new GetTags(makeApiUrl("/tags"), makeAuthorizeHttpClient());
