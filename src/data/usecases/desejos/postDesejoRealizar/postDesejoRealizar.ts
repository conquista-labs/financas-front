import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PostDesejoRealizarModel,
  PostDesejoRealizarParams,
  PostDesejoRealizarRequest,
  PostDesejoRealizarUseCase,
} from "@/domain/usecases";

/** Erro de regra da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (body: unknown): string | undefined => {
  const m = (body as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PostDesejoRealizar implements PostDesejoRealizarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostDesejoRealizarParams,
    body: PostDesejoRealizarRequest,
  ): Promise<PostDesejoRealizarModel> {
    const httpResponse = await this.httpClient.request<PostDesejoRealizarModel>(
      {
        url: `${this.url.replace(":id", params.id)}`,
        method: "post",
        body,
      },
    );

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
