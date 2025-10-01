import { makeApiUrl } from "@/main/factories/http";
import { makeAuthorizeHttpClient } from "@/main/factories/decorators";
import { RemoteGetAnalyticsMeiosPagamento } from "@/data/usecases";
import { GetAnalyticsMeiosPagamentoUsecase } from "@/domain/usecases";

export const makeGetAnalyticsMeiosPagamentoFactory =
  (): GetAnalyticsMeiosPagamentoUsecase =>
    new RemoteGetAnalyticsMeiosPagamento(
      makeApiUrl("/analytics/meios-pagamento"),
      makeAuthorizeHttpClient(),
    );
