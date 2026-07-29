import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchDesejoIdModel,
  PatchDesejoIdParams,
  PatchDesejoIdRequest,
  PatchDesejoIdUseCase,
} from "@/domain/usecases";

export class PatchDesejoId implements PatchDesejoIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    params: PatchDesejoIdParams,
    body: PatchDesejoIdRequest,
  ): Promise<PatchDesejoIdModel> {
    const httpResponse = await this.httpClient.request<PatchDesejoIdModel>({
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
