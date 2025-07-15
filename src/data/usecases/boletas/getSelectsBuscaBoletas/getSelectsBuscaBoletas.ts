import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  GetSelectsBuscaBoletasModel,
  GetSelectsBuscaBoletasUseCase,
} from "@/domain/usecases";

export class GetSelectsBuscaBoletas implements GetSelectsBuscaBoletasUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async get(): Promise<GetSelectsBuscaBoletasModel> {
    const httpResponse =
      await this.httpClient.request<GetSelectsBuscaBoletasModel>({
        url: this.url,
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
