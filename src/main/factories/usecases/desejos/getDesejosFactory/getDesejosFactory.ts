import { GetDesejos } from "@/data/usecases";
import type { GetDesejosUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetDesejosFactory = (): GetDesejosUseCase =>
  new GetDesejos(makeApiUrl("/desejos"), makeAuthorizeHttpClient());
