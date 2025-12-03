import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetPatrimoniosModel,
  GetPatrimoniosParams,
  GetPatrimoniosUseCase,
} from "@/domain/usecases";

export class GetPatrimonios implements GetPatrimoniosUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetPatrimoniosParams): Promise<GetPatrimoniosModel> {
    const httpResponse = await this.httpClient.request<GetPatrimoniosModel>({
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
