import { makeApiUrl } from "@/main/factories/http";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { RemoteGetAnalyticsOrcamento } from "@/data/usecases";
import { GetAnalyticsOrcamentoUsecase } from "@/domain/usecases";

export const makeGetAnalyticsOrcamentoFactory =
  (): GetAnalyticsOrcamentoUsecase =>
    new RemoteGetAnalyticsOrcamento(
      makeApiUrl("/analytics/orcamento"),
      makeAuthorizeHttpClient(),
    );
