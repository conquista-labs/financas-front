import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostTransacoesRequest,
  PostTransacoesModel,
  PostTransacoesUseCase,
} from "@/domain/usecases";

export class PostTransacoes implements PostTransacoesUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostTransacoesRequest): Promise<PostTransacoesModel> {
    const httpResponse = await this.httpClient.request<PostTransacoesModel>({
      url: this.url,
      method: "post",
      body,
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
