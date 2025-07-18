import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchMeiosPagamentoIdRequest,
  PatchMeiosPagamentoIdModel,
  PatchMeiosPagamentoIdUseCase,
  PatchMeiosPagamentoIdParams,
} from "@/domain/usecases";

export class PatchMeiosPagamentoId implements PatchMeiosPagamentoIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchMeiosPagamentoIdRequest,
    params: PatchMeiosPagamentoIdParams,
  ): Promise<PatchMeiosPagamentoIdModel> {
    const httpResponse =
      await this.httpClient.request<PatchMeiosPagamentoIdModel>({
        url: `${this.url.replace(":id", params.id)}`,
        method: "patch",
        body,
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
