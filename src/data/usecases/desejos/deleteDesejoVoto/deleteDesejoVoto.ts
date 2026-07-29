import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteDesejoVotoModel,
  DeleteDesejoVotoParams,
  DeleteDesejoVotoUseCase,
} from "@/domain/usecases";

export class DeleteDesejoVoto implements DeleteDesejoVotoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(params: DeleteDesejoVotoParams): Promise<DeleteDesejoVotoModel> {
    const httpResponse = await this.httpClient.request<DeleteDesejoVotoModel>({
      url: this.url
        .replace(":id", params.id)
        .replace(":pessoaId", params.pessoaId),
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
