import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PostMetaConcluirModel,
  PostMetaConcluirParams,
  PostMetaConcluirRequest,
  PostMetaConcluirUseCase,
} from "@/domain/usecases";

/** Erro de regra da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (body: unknown): string | undefined => {
  const m = (body as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PostMetaConcluir implements PostMetaConcluirUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostMetaConcluirParams,
    body: PostMetaConcluirRequest,
  ): Promise<PostMetaConcluirModel> {
    const httpResponse = await this.httpClient.request<PostMetaConcluirModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "post",
      body,
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
