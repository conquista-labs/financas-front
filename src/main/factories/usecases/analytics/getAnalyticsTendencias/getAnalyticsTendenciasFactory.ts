import { makeApiUrl } from "@/main/factories/http";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { RemoteGetAnalyticsTendencias } from "@/data/usecases";
import { GetAnalyticsTendenciasUsecase } from "@/domain/usecases";

export const makeGetAnalyticsTendenciasFactory =
  (): GetAnalyticsTendenciasUsecase =>
    new RemoteGetAnalyticsTendencias(
      makeApiUrl("/analytics/tendencias"),
      makeAuthorizeHttpClient(),
    );
