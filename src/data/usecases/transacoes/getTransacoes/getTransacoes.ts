import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetTransacoesModel,
  GetTransacoesParams,
  GetTransacoesUseCase,
} from "@/domain/usecases";

export class GetTransacoes implements GetTransacoesUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetTransacoesParams): Promise<GetTransacoesModel> {
    const httpResponse = await this.httpClient.request<GetTransacoesModel>({
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
