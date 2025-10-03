import { GetAnalyticsPadroesTemporais } from "@/data/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";
import { GetAnalyticsPadroesTemporaisUsecase } from "@/domain/usecases/analytics/getAnalyticsPadroesTemporais/getAnalyticsPadroesTemporais";

export const makeGetAnalyticsPadroesTemporaisFactory =
  (): GetAnalyticsPadroesTemporaisUsecase =>
    new GetAnalyticsPadroesTemporais(
      makeApiUrl("/analytics/padroes-temporais"),
      makeAuthorizeHttpClient(),
    );
