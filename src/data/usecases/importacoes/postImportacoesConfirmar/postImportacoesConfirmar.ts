import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostImportacoesConfirmarModel,
  PostImportacoesConfirmarParams,
  PostImportacoesConfirmarUseCase,
} from "@/domain/usecases";

export class PostImportacoesConfirmar
  implements PostImportacoesConfirmarUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async confirmar(
    params: PostImportacoesConfirmarParams,
  ): Promise<PostImportacoesConfirmarModel> {
    const httpResponse =
      await this.httpClient.request<PostImportacoesConfirmarModel>({
        url: this.url,
        method: "post",
        body: params,
      });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
      case HttpStatusCode.created:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
