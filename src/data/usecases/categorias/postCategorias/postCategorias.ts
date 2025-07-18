import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostCategoriasRequest,
  PostCategoriasModel,
  PostCategoriasUseCase,
} from "@/domain/usecases";

export class PostCategorias implements PostCategoriasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostCategoriasRequest): Promise<PostCategoriasModel> {
    const httpResponse = await this.httpClient.request<PostCategoriasModel>({
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
