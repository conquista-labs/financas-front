import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCategoriasModel,
  GetCategoriasParams,
  GetCategoriasUseCase,
} from "@/domain/usecases";

export class GetCategorias implements GetCategoriasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetCategoriasParams): Promise<GetCategoriasModel> {
    const httpResponse = await this.httpClient.request<GetCategoriasModel>({
      url: this.url,
      method: "get",
      params,
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
