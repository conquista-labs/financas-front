import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchTransacoesIdRequest,
  PatchTransacoesIdModel,
  PatchTransacoesIdUseCase,
  PatchTransacoesIdParams,
} from "@/domain/usecases";

export class PatchTransacoesId implements PatchTransacoesIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchTransacoesIdRequest,
    params: PatchTransacoesIdParams,
  ): Promise<PatchTransacoesIdModel> {
    const httpResponse = await this.httpClient.request<PatchTransacoesIdModel>({
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
