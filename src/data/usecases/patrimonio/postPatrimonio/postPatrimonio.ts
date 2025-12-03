import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostPatrimonioModel,
  PostPatrimonioRequest,
  PostPatrimonioUseCase,
} from "@/domain/usecases";

export class PostPatrimonio implements PostPatrimonioUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(body: PostPatrimonioRequest): Promise<PostPatrimonioModel> {
    const httpResponse = await this.httpClient.request<PostPatrimonioModel>({
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
