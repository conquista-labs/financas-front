import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetMetaIdModel,
  GetMetaIdParams,
  GetMetaIdUseCase,
} from "@/domain/usecases";

export class GetMetaId implements GetMetaIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetMetaIdParams): Promise<GetMetaIdModel> {
    const httpResponse = await this.httpClient.request<GetMetaIdModel>({
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
