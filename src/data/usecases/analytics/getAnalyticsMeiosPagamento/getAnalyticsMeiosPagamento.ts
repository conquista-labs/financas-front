import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import {
  GetAnalyticsMeiosPagamentoModel,
  GetAnalyticsMeiosPagamentoParams,
  GetAnalyticsMeiosPagamentoUsecase,
} from "@/domain/usecases";
import { UnexpectedError } from "@/domain/errors";

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
