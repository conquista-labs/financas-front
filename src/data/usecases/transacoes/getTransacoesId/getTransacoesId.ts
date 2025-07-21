import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetTransacoesIdModel,
  GetTransacoesIdParams,
  GetTransacoesIdUseCase,
} from "@/domain/usecases";

export class GetTransacoesId implements GetTransacoesIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetTransacoesIdParams): Promise<GetTransacoesIdModel> {
    const httpResponse = await this.httpClient.request<GetTransacoesIdModel>({
      url: this.url.replace(":id", params.id),
      method: "get",
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
