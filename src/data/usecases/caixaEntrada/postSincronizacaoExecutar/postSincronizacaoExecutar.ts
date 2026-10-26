import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostSincronizacaoExecutarModel,
  PostSincronizacaoExecutarUseCase,
} from "@/domain/usecases";

export class PostSincronizacaoExecutar
  implements PostSincronizacaoExecutarUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(): Promise<PostSincronizacaoExecutarModel> {
    const httpResponse =
      await this.httpClient.request<PostSincronizacaoExecutarModel>({
        url: this.url,
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
