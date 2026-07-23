import type { HttpClient } from "@/data/protocols/http";
import { HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/errors";
import type {
  GetAnalyticsTendenciasModel,
  GetAnalyticsTendenciasParams,
  GetAnalyticsTendenciasUsecase,
} from "@/domain/usecases/analytics";

export class RemoteGetAnalyticsTendencias
  implements GetAnalyticsTendenciasUsecase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetAnalyticsTendenciasParams,
  ): Promise<GetAnalyticsTendenciasModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetAnalyticsTendenciasModel;
      default:
        throw new UnexpectedError();
    }
  }
}
