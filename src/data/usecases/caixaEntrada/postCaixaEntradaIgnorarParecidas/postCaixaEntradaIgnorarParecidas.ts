import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaIgnorarParecidasModel,
  PostCaixaEntradaIgnorarParecidasUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaIgnorarParecidas
  implements PostCaixaEntradaIgnorarParecidasUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(): Promise<PostCaixaEntradaIgnorarParecidasModel> {
    const httpResponse =
      await this.httpClient.request<PostCaixaEntradaIgnorarParecidasModel>({
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
