import { GetSelectsBuscaBoletas } from "@/data/usecases";
import type { GetSelectsBuscaBoletasUseCase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetSelectsBuscaBoletasFactory =
  (): GetSelectsBuscaBoletasUseCase =>
    new GetSelectsBuscaBoletas(
      makeApiUrl("/v1/boletas/selects"),
      makeAuthorizeHttpClient(),
    );
