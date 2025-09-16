import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetCalendarioModel,
  GetCalendarioParams,
  GetCalendarioUseCase,
} from "@/domain/usecases";

export class GetCalendario implements GetCalendarioUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(params: GetCalendarioParams): Promise<GetCalendarioModel> {
    const httpResponse = await this.httpClient.request<GetCalendarioModel>({
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
