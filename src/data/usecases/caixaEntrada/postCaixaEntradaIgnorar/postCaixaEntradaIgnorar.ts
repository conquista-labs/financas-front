import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaIgnorarModel,
  PostCaixaEntradaIgnorarParams,
  PostCaixaEntradaIgnorarUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaIgnorar implements PostCaixaEntradaIgnorarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostCaixaEntradaIgnorarParams,
  ): Promise<PostCaixaEntradaIgnorarModel> {
    const httpResponse =
      await this.httpClient.request<PostCaixaEntradaIgnorarModel>({
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
