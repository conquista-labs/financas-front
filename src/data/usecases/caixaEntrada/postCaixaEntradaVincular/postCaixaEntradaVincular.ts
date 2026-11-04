import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaVincularModel,
  PostCaixaEntradaVincularParams,
  PostCaixaEntradaVincularUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaVincular implements PostCaixaEntradaVincularUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(params: PostCaixaEntradaVincularParams): Promise<PostCaixaEntradaVincularModel> {
    const httpResponse = await this.httpClient.request<PostCaixaEntradaVincularModel>({
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
