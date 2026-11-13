import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCaixaEntradaLimparIgnoradosModel,
  PostCaixaEntradaLimparIgnoradosUseCase,
} from "@/domain/usecases";

export class PostCaixaEntradaLimparIgnorados
  implements PostCaixaEntradaLimparIgnoradosUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(): Promise<PostCaixaEntradaLimparIgnoradosModel> {
    const httpResponse =
      await this.httpClient.request<PostCaixaEntradaLimparIgnoradosModel>({
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
