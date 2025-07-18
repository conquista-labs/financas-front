import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdUseCase,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";

export class DeleteCategoriasId implements DeleteCategoriasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(
    params: DeleteCategoriasIdParams,
  ): Promise<DeleteCategoriasIdModel> {
    const httpResponse = await this.httpClient.request<DeleteCategoriasIdModel>(
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
