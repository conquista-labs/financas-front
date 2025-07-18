import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteMeiosPagamentoIdModel,
  DeleteMeiosPagamentoIdUseCase,
  DeleteMeiosPagamentoIdParams,
} from "@/domain/usecases";

export class DeleteMeiosPagamentoId implements DeleteMeiosPagamentoIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(
    params: DeleteMeiosPagamentoIdParams,
  ): Promise<DeleteMeiosPagamentoIdModel> {
    const httpResponse =
      await this.httpClient.request<DeleteMeiosPagamentoIdModel>({
        url: `${this.url.replace(":id", params.id)}`,
        method: "delete",
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
