import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostLoginWithGoogleModel,
  PostLoginWithGoogleRequest,
  PostLoginWithGoogleUseCase,
} from "@/domain/usecases";

export class PostLoginWithGoogle implements PostLoginWithGoogleUseCase {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpClient,
  ) {}

  async excute(
    body: PostLoginWithGoogleRequest,
  ): Promise<PostLoginWithGoogleModel> {
    const httpResponse =
      await this.httpPostClient.request<PostLoginWithGoogleModel>({
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
