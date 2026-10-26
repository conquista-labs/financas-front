import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaRestaurarModel,
  PostCaixaEntradaRestaurarParams,
  PostCaixaEntradaRestaurarUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaRestaurar
  implements PostCaixaEntradaRestaurarUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostCaixaEntradaRestaurarParams,
  ): Promise<PostCaixaEntradaRestaurarModel> {
    const httpResponse =
      await this.httpClient.request<PostCaixaEntradaRestaurarModel>({
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
