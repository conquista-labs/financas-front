import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostRecorrenciasModel,
  PostRecorrenciasRequest,
  PostRecorrenciasUseCase,
} from "@/domain/usecases";

export class PostRecorrencias implements PostRecorrenciasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostRecorrenciasRequest): Promise<PostRecorrenciasModel> {
    const httpResponse = await this.httpClient.request<PostRecorrenciasModel>({
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
