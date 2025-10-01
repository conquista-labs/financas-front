import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import {
  GetQuickStatsModel,
  GetQuickStatsParams,
  GetQuickStatsUsecase,
} from "@/domain/usecases";
import { UnexpectedError } from "@/domain/errors";

export class GetQuickStats implements GetQuickStatsUsecase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetQuickStatsParams): Promise<GetQuickStatsModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body as GetQuickStatsModel;
      default:
        throw new UnexpectedError();
    }
  }
}
