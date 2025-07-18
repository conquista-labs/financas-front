import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetMeiosPagamentoModel,
  GetMeiosPagamentoParams,
  GetMeiosPagamentoUseCase,
} from "@/domain/usecases";

export class GetMeiosPagamento implements GetMeiosPagamentoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetMeiosPagamentoParams): Promise<GetMeiosPagamentoModel> {
    const httpResponse = await this.httpClient.request<GetMeiosPagamentoModel>({
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
