import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostMetaAporteModel,
  PostMetaAporteParams,
  PostMetaAporteRequest,
  PostMetaAporteUseCase,
} from "@/domain/usecases";

export class PostMetaAporte implements PostMetaAporteUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async post(
    params: PostMetaAporteParams,
    body: PostMetaAporteRequest,
  ): Promise<PostMetaAporteModel> {
    const httpResponse = await this.httpClient.request<PostMetaAporteModel>({
      url: `${this.url.replace(":id", params.id)}`,
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
