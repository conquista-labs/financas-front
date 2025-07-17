import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchPessoasIdRequest,
  PatchPessoasIdModel,
  PatchPessoasIdUseCase,
  PatchPessoasIdParams,
} from "@/domain/usecases";

export class PatchPessoasId implements PatchPessoasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchPessoasIdRequest,
    params: PatchPessoasIdParams,
  ): Promise<PatchPessoasIdModel> {
    const httpResponse = await this.httpClient.request<PatchPessoasIdModel>({
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
