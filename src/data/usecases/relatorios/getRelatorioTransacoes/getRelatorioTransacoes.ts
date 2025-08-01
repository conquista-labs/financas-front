import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetRelatorioTransacoesModel,
  GetRelatorioTransacoesParams,
  GetRelatorioTransacoesUseCase,
} from "@/domain/usecases";

export class GetRelatorioTransacoes implements GetRelatorioTransacoesUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetRelatorioTransacoesParams,
  ): Promise<GetRelatorioTransacoesModel> {
    const httpResponse =
      await this.httpClient.request<GetRelatorioTransacoesModel>({
        url: this.url,
        method: "get",
        responseType: "blob",
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
