import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteTransacoesIdModel,
  DeleteTransacoesIdUseCase,
  DeleteTransacoesIdParams,
} from "@/domain/usecases";

export class DeleteTransacoesId implements DeleteTransacoesIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(
    params: DeleteTransacoesIdParams,
  ): Promise<DeleteTransacoesIdModel> {
    const httpResponse = await this.httpClient.request<DeleteTransacoesIdModel>(
      {
        url: `${this.url.replace(":id", params.id)}`,
        method: "delete",
      },
    );

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
