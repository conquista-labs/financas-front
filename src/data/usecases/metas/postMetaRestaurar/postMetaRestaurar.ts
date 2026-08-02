import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostMetaRestaurarModel,
  PostMetaRestaurarParams,
  PostMetaRestaurarUseCase,
} from "@/domain/usecases";

export class PostMetaRestaurar implements PostMetaRestaurarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(params: PostMetaRestaurarParams): Promise<PostMetaRestaurarModel> {
    const httpResponse = await this.httpClient.request<PostMetaRestaurarModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "post",
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
