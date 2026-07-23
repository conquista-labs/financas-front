import { RemoteGetAnalyticsTendencias } from "@/data/usecases";
import type { GetAnalyticsTendenciasUsecase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetAnalyticsTendenciasFactory =
  (): GetAnalyticsTendenciasUsecase =>
    new RemoteGetAnalyticsTendencias(
      makeApiUrl("/analytics/tendencias"),
      makeAuthorizeHttpClient(),
    );
