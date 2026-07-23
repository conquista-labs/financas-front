import { RemoteGetAnalyticsOrcamento } from "@/data/usecases";
import type { GetAnalyticsOrcamentoUsecase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetAnalyticsOrcamentoFactory =
  (): GetAnalyticsOrcamentoUsecase =>
    new RemoteGetAnalyticsOrcamento(
      makeApiUrl("/analytics/orcamento"),
      makeAuthorizeHttpClient(),
    );
