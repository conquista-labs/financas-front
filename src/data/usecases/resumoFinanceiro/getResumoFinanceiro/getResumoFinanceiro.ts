import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetResumoFinanceiroModel,
  GetResumoFinanceiroParams,
  GetResumoFinanceiroUseCase,
} from "@/domain/usecases";

export class GetResumoFinanceiro implements GetResumoFinanceiroUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetResumoFinanceiroParams,
  ): Promise<GetResumoFinanceiroModel> {
    const httpResponse =
      await this.httpClient.request<GetResumoFinanceiroModel>({
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
