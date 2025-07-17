import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetPessoasModel,
  GetPessoasParams,
  GetPessoasUseCase,
} from "@/domain/usecases";

export class GetPessoas implements GetPessoasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetPessoasParams): Promise<GetPessoasModel> {
    const httpResponse = await this.httpClient.request<GetPessoasModel>({
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
