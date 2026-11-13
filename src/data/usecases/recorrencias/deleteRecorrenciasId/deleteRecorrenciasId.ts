import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteRecorrenciasIdModel,
  DeleteRecorrenciasIdParams,
  DeleteRecorrenciasIdUseCase,
} from "@/domain/usecases";

export class DeleteRecorrenciasId implements DeleteRecorrenciasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(
    params: DeleteRecorrenciasIdParams,
  ): Promise<DeleteRecorrenciasIdModel> {
    const httpResponse =
      await this.httpClient.request<DeleteRecorrenciasIdModel>({
        url: this.url.replace(":id", params.id),
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
