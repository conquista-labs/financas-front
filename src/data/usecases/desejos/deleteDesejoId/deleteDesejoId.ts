import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteDesejoIdParams,
  DeleteDesejoIdUseCase,
} from "@/domain/usecases";

export class DeleteDesejoId implements DeleteDesejoIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(params: DeleteDesejoIdParams): Promise<void> {
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
