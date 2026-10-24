import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaAceitarModel,
  PostCaixaEntradaAceitarParams,
  PostCaixaEntradaAceitarUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaAceitar implements PostCaixaEntradaAceitarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(params: PostCaixaEntradaAceitarParams): Promise<PostCaixaEntradaAceitarModel> {
    const httpResponse = await this.httpClient.request<PostCaixaEntradaAceitarModel>({
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
