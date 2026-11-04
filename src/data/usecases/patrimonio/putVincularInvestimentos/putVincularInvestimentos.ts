import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import {
  InvalidCredentialsError,
  UnexpectedError,
  UnprocessableEntity,
} from "@/domain/errors";
import type {
  PutVincularInvestimentosModel,
  PutVincularInvestimentosParams,
  PutVincularInvestimentosRequest,
  PutVincularInvestimentosUseCase,
} from "@/domain/usecases";

/** Erro de regra da API (400) com a mensagem dela — a tela mostra no toast. */
const mensagemDaApi = (b: unknown): string | undefined => {
  const m = (b as { message?: string | string[] } | undefined)?.message;
  return Array.isArray(m) ? m[0] : m;
};

export class PutVincularInvestimentos
  implements PutVincularInvestimentosUseCase
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async put(
    params: PutVincularInvestimentosParams,
    body: PutVincularInvestimentosRequest,
  ): Promise<PutVincularInvestimentosModel> {
    const httpResponse =
      await this.httpClient.request<PutVincularInvestimentosModel>({
        url: `${this.url.replace(":patrimonioId", params.patrimonioId)}`,
        method: "put",
        body,
      });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
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
