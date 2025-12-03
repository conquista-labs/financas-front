import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeletePatrimonioIdParams,
  DeletePatrimonioIdUseCase,
} from "@/domain/usecases";

export class DeletePatrimonioId implements DeletePatrimonioIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(params: DeletePatrimonioIdParams): Promise<void> {
    const httpResponse = await this.httpClient.request<void>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "delete",
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent:
      case HttpStatusCode.ok:
        return;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
