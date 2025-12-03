import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchPatrimonioIdModel,
  PatchPatrimonioIdParams,
  PatchPatrimonioIdRequest,
  PatchPatrimonioIdUseCase,
} from "@/domain/usecases";

export class PatchPatrimonioId implements PatchPatrimonioIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    params: PatchPatrimonioIdParams,
    body: PatchPatrimonioIdRequest,
  ): Promise<PatchPatrimonioIdModel> {
    const httpResponse = await this.httpClient.request<PatchPatrimonioIdModel>({
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
