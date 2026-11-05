import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PatchPatrimonioIdModel,
  PatchPatrimonioIdParams,
  PatchPatrimonioIdRequest,
  PatchPatrimonioIdUseCase,
} from "@/domain/usecases";

/** Validação da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (b: unknown): string | undefined => {
  const m = (b as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PatchPatrimonioId implements PatchPatrimonioIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    params: PatchPatrimonioIdParams,
    body: PatchPatrimonioIdRequest,
  ): Promise<PatchPatrimonioIdModel> {
    const httpResponse = await this.httpClient.request<PatchPatrimonioIdModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "patch",
      body,
    });

    switch (httpResponse.statusCode) {
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
