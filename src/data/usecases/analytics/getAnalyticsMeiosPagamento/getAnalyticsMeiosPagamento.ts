import type { HttpClient } from "@/data/protocols/http";
import { HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/errors";
import type {
  GetAnalyticsMeiosPagamentoModel,
  GetAnalyticsMeiosPagamentoParams,
  GetAnalyticsMeiosPagamentoUsecase,
} from "@/domain/usecases";

export class RemoteGetAnalyticsMeiosPagamento
  implements GetAnalyticsMeiosPagamentoUsecase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetAnalyticsMeiosPagamentoParams,
  ): Promise<GetAnalyticsMeiosPagamentoModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetAnalyticsMeiosPagamentoModel;
      default:
        throw new UnexpectedError();
    }
  }
}
