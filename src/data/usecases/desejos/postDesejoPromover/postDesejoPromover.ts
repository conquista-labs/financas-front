import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostDesejoPromoverModel,
  PostDesejoPromoverParams,
  PostDesejoPromoverRequest,
  PostDesejoPromoverUseCase,
} from "@/domain/usecases";

export class PostDesejoPromover implements PostDesejoPromoverUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostDesejoPromoverParams,
    body: PostDesejoPromoverRequest,
  ): Promise<PostDesejoPromoverModel> {
    const httpResponse = await this.httpClient.request<PostDesejoPromoverModel>(
      {
        url: `${this.url.replace(":id", params.id)}`,
        method: "post",
        body,
      },
    );

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
