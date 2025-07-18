import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PatchCategoriasIdRequest,
  PatchCategoriasIdModel,
  PatchCategoriasIdUseCase,
  PatchCategoriasIdParams,
} from "@/domain/usecases";

export class PatchCategoriasId implements PatchCategoriasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async patch(
    body: PatchCategoriasIdRequest,
    params: PatchCategoriasIdParams,
  ): Promise<PatchCategoriasIdModel> {
    const httpResponse = await this.httpClient.request<PatchCategoriasIdModel>({
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
