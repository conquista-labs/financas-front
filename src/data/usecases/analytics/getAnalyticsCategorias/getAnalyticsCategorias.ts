import type { HttpClient } from "@/data/protocols/http";
import { HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/errors";
import type {
  GetAnalyticsCategoriasModel,
  GetAnalyticsCategoriasParams,
  GetAnalyticsCategoriasUsecase,
} from "@/domain/usecases";

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
