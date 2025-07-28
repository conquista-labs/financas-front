import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostResumoFinanceiroModel,
  PostResumoFinanceiroParms,
  PostResumoFinanceiroUseCase,
} from "@/domain/usecases";

export class PostResumoFinanceiro implements PostResumoFinanceiroUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostResumoFinanceiroParms,
  ): Promise<PostResumoFinanceiroModel> {
    const httpResponse =
      await this.httpClient.request<PostResumoFinanceiroModel>({
        url: `${this.url.replace(":ano", `${params.year}`)}`,
        method: "post",
      });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
