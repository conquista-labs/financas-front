import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostMetaModel,
  PostMetaRequest,
  PostMetaUseCase,
} from "@/domain/usecases";

export class PostMeta implements PostMetaUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostMetaRequest): Promise<PostMetaModel> {
    const httpResponse = await this.httpClient.request<PostMetaModel>({
      url: this.url,
      method: "post",
      body,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
