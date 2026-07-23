import { RemoteGetAnalyticsMeiosPagamento } from "@/data/usecases";
import type { GetAnalyticsMeiosPagamentoUsecase } from "@/domain/usecases";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { makeApiUrl } from "@/main/factories/http";

export const makeGetAnalyticsMeiosPagamentoFactory =
  (): GetAnalyticsMeiosPagamentoUsecase =>
    new RemoteGetAnalyticsMeiosPagamento(
      makeApiUrl("/analytics/meios-pagamento"),
      makeAuthorizeHttpClient(),
    );
