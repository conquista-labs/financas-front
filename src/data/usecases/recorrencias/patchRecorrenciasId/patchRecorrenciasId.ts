import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchRecorrenciasIdModel,
  PatchRecorrenciasIdParams,
  PatchRecorrenciasIdRequest,
  PatchRecorrenciasIdUseCase,
} from "@/domain/usecases";

export class PatchRecorrenciasId implements PatchRecorrenciasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchRecorrenciasIdRequest,
    params: PatchRecorrenciasIdParams,
  ): Promise<PatchRecorrenciasIdModel> {
    const httpResponse =
      await this.httpClient.request<PatchRecorrenciasIdModel>({
        url: this.url.replace(":id", params.id),
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
