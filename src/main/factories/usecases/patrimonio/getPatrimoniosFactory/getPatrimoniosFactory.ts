import { GetPatrimonios } from "@/data/usecases";
import type { GetPatrimoniosUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetPatrimoniosFactory = (): GetPatrimoniosUseCase =>
  new GetPatrimonios(makeApiUrl("/patrimonios"), makeAuthorizeHttpClient());
