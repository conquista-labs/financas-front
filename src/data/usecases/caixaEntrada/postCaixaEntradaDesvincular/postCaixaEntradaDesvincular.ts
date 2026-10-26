import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaDesvincularModel,
  PostCaixaEntradaDesvincularParams,
  PostCaixaEntradaDesvincularUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaDesvincular
  implements PostCaixaEntradaDesvincularUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostCaixaEntradaDesvincularParams,
  ): Promise<PostCaixaEntradaDesvincularModel> {
    const httpResponse =
      await this.httpClient.request<PostCaixaEntradaDesvincularModel>({
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
