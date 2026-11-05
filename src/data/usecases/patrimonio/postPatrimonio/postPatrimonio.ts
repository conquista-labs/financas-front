import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PostPatrimonioModel,
  PostPatrimonioRequest,
  PostPatrimonioUseCase,
} from "@/domain/usecases";

/** Validação da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (b: unknown): string | undefined => {
  const m = (b as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PostPatrimonio implements PostPatrimonioUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostPatrimonioRequest): Promise<PostPatrimonioModel> {
    const httpResponse = await this.httpClient.request<PostPatrimonioModel>({
      url: this.url,
      method: "post",
      body,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
        return httpResponse.body;
      case HttpStatusCode.badRequest:
        throw new UnprocessableEntity(mensagemDaApi(httpResponse.body));
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
