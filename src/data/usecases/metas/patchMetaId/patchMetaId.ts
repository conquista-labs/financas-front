import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchMetaIdModel,
  PatchMetaIdParams,
  PatchMetaIdRequest,
  PatchMetaIdUseCase,
} from "@/domain/usecases";

export class PatchMetaId implements PatchMetaIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    params: PatchMetaIdParams,
    body: PatchMetaIdRequest,
  ): Promise<PatchMetaIdModel> {
    const httpResponse = await this.httpClient.request<PatchMetaIdModel>({
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
