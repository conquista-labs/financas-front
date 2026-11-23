import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostTransacoesPagarLoteModel,
  PostTransacoesPagarLoteParams,
  PostTransacoesPagarLoteUseCase,
} from "@/domain/usecases";

export class PostTransacoesPagarLote implements PostTransacoesPagarLoteUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async pagarLote(
    body: PostTransacoesPagarLoteParams,
  ): Promise<PostTransacoesPagarLoteModel> {
    const httpResponse =
      await this.httpClient.request<PostTransacoesPagarLoteModel>({
        url: this.url,
        method: "post",
        body,
      });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
      case HttpStatusCode.created:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
