import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetResumoPatrimonioModel,
  GetResumoPatrimonioParams,
  GetResumoPatrimonioUseCase,
} from "@/domain/usecases";

export class GetResumoPatrimonio implements GetResumoPatrimonioUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetResumoPatrimonioParams,
  ): Promise<GetResumoPatrimonioModel> {
    const httpResponse =
      await this.httpClient.request<GetResumoPatrimonioModel>({
        url: this.url,
        method: "get",
        params,
      });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
