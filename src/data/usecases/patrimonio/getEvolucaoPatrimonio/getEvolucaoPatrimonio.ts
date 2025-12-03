import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetEvolucaoPatrimonioModel,
  GetEvolucaoPatrimonioParams,
  GetEvolucaoPatrimonioUseCase,
} from "@/domain/usecases";

export class GetEvolucaoPatrimonio implements GetEvolucaoPatrimonioUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetEvolucaoPatrimonioParams,
  ): Promise<GetEvolucaoPatrimonioModel> {
    const httpResponse =
      await this.httpClient.request<GetEvolucaoPatrimonioModel>({
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
