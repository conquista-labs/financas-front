import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchContasVinculadasIdModel,
  PatchContasVinculadasIdParams,
  PatchContasVinculadasIdRequest,
  PatchContasVinculadasIdUseCase,
} from "@/domain/usecases";

export class PatchContasVinculadasId implements PatchContasVinculadasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchContasVinculadasIdRequest,
    params: PatchContasVinculadasIdParams,
  ): Promise<PatchContasVinculadasIdModel> {
    const httpResponse =
      await this.httpClient.request<PatchContasVinculadasIdModel>({
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
