import { GetAnalyticsPadroesTemporais } from "@/data/usecases";
import type { GetAnalyticsPadroesTemporaisUsecase } from "@/domain/usecases/analytics/getAnalyticsPadroesTemporais/getAnalyticsPadroesTemporais";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetAnalyticsPadroesTemporaisFactory =
  (): GetAnalyticsPadroesTemporaisUsecase =>
    new GetAnalyticsPadroesTemporais(
      makeApiUrl("/analytics/padroes-temporais"),
      makeAuthorizeHttpClient(),
    );
