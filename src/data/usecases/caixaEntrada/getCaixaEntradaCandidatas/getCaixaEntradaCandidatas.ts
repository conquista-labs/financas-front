import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCaixaEntradaCandidatasModel,
  GetCaixaEntradaCandidatasParams,
  GetCaixaEntradaCandidatasUseCase,
} from "@/domain/usecases";

export class GetCaixaEntradaCandidatas implements GetCaixaEntradaCandidatasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetCaixaEntradaCandidatasParams): Promise<GetCaixaEntradaCandidatasModel> {
    const httpResponse = await this.httpClient.request<GetCaixaEntradaCandidatasModel>({
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
