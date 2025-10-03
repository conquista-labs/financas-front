import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import {
  GetAnalyticsPadroesTemporaisModel,
  GetAnalyticsPadroesTemporaisParams,
  GetAnalyticsPadroesTemporaisUsecase,
} from "@/domain/usecases";
import { UnexpectedError } from "@/domain/errors";

export class GetAnalyticsPadroesTemporais
  implements GetAnalyticsPadroesTemporaisUsecase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetAnalyticsPadroesTemporaisParams,
  ): Promise<GetAnalyticsPadroesTemporaisModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetAnalyticsPadroesTemporaisModel;
      default:
        throw new UnexpectedError();
    }
  }
}
