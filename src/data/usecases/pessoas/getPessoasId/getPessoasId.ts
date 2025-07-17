import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetPessoasIdModel,
  GetPessoasIdParams,
  GetPessoasIdUseCase,
} from "@/domain/usecases";

export class GetPessoasId implements GetPessoasIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetPessoasIdParams): Promise<GetPessoasIdModel> {
    const httpResponse = await this.httpClient.request<GetPessoasIdModel>({
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
