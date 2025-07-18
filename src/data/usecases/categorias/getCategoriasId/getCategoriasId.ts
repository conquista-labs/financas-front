import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCategoriasIdModel,
  GetCategoriasIdParams,
  GetCategoriasIdUseCase,
} from "@/domain/usecases";

export class GetCategoriasId implements GetCategoriasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetCategoriasIdParams): Promise<GetCategoriasIdModel> {
    const httpResponse = await this.httpClient.request<GetCategoriasIdModel>({
      url: this.url.replace(":id", params.id),
      method: "get",
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
