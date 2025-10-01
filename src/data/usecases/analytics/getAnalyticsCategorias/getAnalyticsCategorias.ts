import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import {
  GetAnalyticsCategoriasModel,
  GetAnalyticsCategoriasParams,
  GetAnalyticsCategoriasUsecase,
} from "@/domain/usecases";
import { UnexpectedError } from "@/domain/errors";

export class GetAnalyticsCategorias implements GetAnalyticsCategoriasUsecase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetAnalyticsCategoriasParams,
  ): Promise<GetAnalyticsCategoriasModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetAnalyticsCategoriasModel;
      default:
        throw new UnexpectedError();
    }
  }
}
