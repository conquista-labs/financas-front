import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetMeiosPagamentoIdModel,
  GetMeiosPagamentoIdParams,
  GetMeiosPagamentoIdUseCase,
} from "@/domain/usecases";

export class GetMeiosPagamentoId implements GetMeiosPagamentoIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(
    params: GetMeiosPagamentoIdParams,
  ): Promise<GetMeiosPagamentoIdModel> {
    const httpResponse =
      await this.httpClient.request<GetMeiosPagamentoIdModel>({
        url: this.url.replace(":id", params.id),
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
