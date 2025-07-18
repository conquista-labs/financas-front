import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostMeiosPagamentoRequest,
  PostMeiosPagamentoModel,
  PostMeiosPagamentoUseCase,
} from "@/domain/usecases";

export class PostMeiosPagamento implements PostMeiosPagamentoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    body: PostMeiosPagamentoRequest,
  ): Promise<PostMeiosPagamentoModel> {
    const httpResponse = await this.httpClient.request<PostMeiosPagamentoModel>(
      {
        url: this.url,
        method: "post",
        body,
      },
    );

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
