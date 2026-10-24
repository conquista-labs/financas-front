import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCaixaEntradaResumoModel,
  GetCaixaEntradaResumoUseCase,
} from "@/domain/usecases";

export class GetCaixaEntradaResumo implements GetCaixaEntradaResumoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(): Promise<GetCaixaEntradaResumoModel> {
    const httpResponse = await this.httpClient.request<GetCaixaEntradaResumoModel>({
        url: this.url,
        method: "get",
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
