import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeletePessoasIdModel,
  DeletePessoasIdUseCase,
  DeletePessoasIdParams,
} from "@/domain/usecases";

export class DeletePessoasId implements DeletePessoasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(params: DeletePessoasIdParams): Promise<DeletePessoasIdModel> {
    const httpResponse = await this.httpClient.request<DeletePessoasIdModel>({
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
