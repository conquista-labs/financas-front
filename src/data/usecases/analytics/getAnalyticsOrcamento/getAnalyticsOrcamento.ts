import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import {
  GetAnalyticsOrcamentoModel,
  GetAnalyticsOrcamentoParams,
  GetAnalyticsOrcamentoUsecase,
} from "@/domain/usecases";
import { UnexpectedError } from "@/domain/errors";

export class RemoteGetAnalyticsOrcamento
  implements GetAnalyticsOrcamentoUsecase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetAnalyticsOrcamentoParams,
  ): Promise<GetAnalyticsOrcamentoModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetAnalyticsOrcamentoModel;
      default:
        throw new UnexpectedError();
    }
  }
}
