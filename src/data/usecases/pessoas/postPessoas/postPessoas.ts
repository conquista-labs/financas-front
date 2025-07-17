import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostPessoasRequest,
  PostPessoasModel,
  PostPessoasUseCase,
} from "@/domain/usecases";

export class PostPessoas implements PostPessoasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostPessoasRequest): Promise<PostPessoasModel> {
    const httpResponse = await this.httpClient.request<PostPessoasModel>({
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
