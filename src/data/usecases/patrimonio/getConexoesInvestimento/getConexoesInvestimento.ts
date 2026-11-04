import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  GetConexoesInvestimentoModel,
  GetConexoesInvestimentoUseCase,
} from "@/domain/usecases";

/** Erro de regra da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (b: unknown): string | undefined => {
  const m = (b as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class GetConexoesInvestimento implements GetConexoesInvestimentoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(): Promise<GetConexoesInvestimentoModel> {
    const httpResponse =
      await this.httpClient.request<GetConexoesInvestimentoModel>({
        url: this.url,
        method: "get",
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
