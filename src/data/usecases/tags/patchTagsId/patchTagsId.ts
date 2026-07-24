import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchTagsIdModel,
  PatchTagsIdParams,
  PatchTagsIdRequest,
  PatchTagsIdUseCase,
} from "@/domain/usecases";

export class PatchTagsId implements PatchTagsIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchTagsIdRequest,
    params: PatchTagsIdParams,
  ): Promise<PatchTagsIdModel> {
    const httpResponse = await this.httpClient.request<PatchTagsIdModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "patch",
      body,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
