import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostTransacoesIdPagarModel,
  PostTransacoesIdPagarParams,
  PostTransacoesIdPagarUseCase,
} from "@/domain/usecases";

export class PostTransacoesIdPagar implements PostTransacoesIdPagarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async pagar(
    params: PostTransacoesIdPagarParams,
  ): Promise<PostTransacoesIdPagarModel> {
    const httpResponse =
      await this.httpClient.request<PostTransacoesIdPagarModel>({
        url: `${this.url.replace(":id", params.id)}`,
        method: "post",
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
