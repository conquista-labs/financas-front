import { GetEnums } from "@/data/usecases";
import type { GetEnumsUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetEnumsFactory = (): GetEnumsUseCase =>
  new GetEnums(makeApiUrl("/enums"), makeAuthorizeHttpClient());
