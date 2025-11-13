import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostLogoutGoogleUseCase,
  PostLogoutGoogleModel,
} from "@/domain/usecases";

export class PostLogoutGoogle implements PostLogoutGoogleUseCase {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpClient,
  ) {}

  async excute(): Promise<PostLogoutGoogleModel> {
    const httpResponse =
      await this.httpPostClient.request<PostLogoutGoogleModel>({
        url: this.url,
        method: "post",
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
