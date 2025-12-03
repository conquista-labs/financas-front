import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetPatrimonioIdModel,
  GetPatrimonioIdParams,
  GetPatrimonioIdUseCase,
} from "@/domain/usecases";

export class GetPatrimonioId implements GetPatrimonioIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetPatrimonioIdParams): Promise<GetPatrimonioIdModel> {
    const httpResponse = await this.httpClient.request<GetPatrimonioIdModel>({
      url: `${this.url.replace(":id", params.id)}`,
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
