import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaExcluirModel,
  PostCaixaEntradaExcluirParams,
  PostCaixaEntradaExcluirUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaExcluir implements PostCaixaEntradaExcluirUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(params: PostCaixaEntradaExcluirParams): Promise<PostCaixaEntradaExcluirModel> {
    const httpResponse = await this.httpClient.request<PostCaixaEntradaExcluirModel>({
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
