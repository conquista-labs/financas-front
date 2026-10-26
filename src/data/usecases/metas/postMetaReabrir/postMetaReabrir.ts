import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PostMetaReabrirModel,
  PostMetaReabrirParams,
  PostMetaReabrirUseCase,
} from "@/domain/usecases";

/** Erro de regra da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (body: unknown): string | undefined => {
  const m = (body as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PostMetaReabrir implements PostMetaReabrirUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(params: PostMetaReabrirParams): Promise<PostMetaReabrirModel> {
    const httpResponse = await this.httpClient.request<PostMetaReabrirModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "post",
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
      case HttpStatusCode.ok:
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
