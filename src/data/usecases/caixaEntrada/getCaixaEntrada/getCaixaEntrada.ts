import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCaixaEntradaModel,
  GetCaixaEntradaParams,
  GetCaixaEntradaUseCase,
} from "@/domain/usecases";

export class GetCaixaEntrada implements GetCaixaEntradaUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetCaixaEntradaParams): Promise<GetCaixaEntradaModel> {
    const httpResponse = await this.httpClient.request<GetCaixaEntradaModel>({
      url: this.url,
      method: "get",
      params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
