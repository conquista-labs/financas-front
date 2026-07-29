import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PutDesejoVotoModel,
  PutDesejoVotoParams,
  PutDesejoVotoUseCase,
} from "@/domain/usecases";

export class PutDesejoVoto implements PutDesejoVotoUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async put(params: PutDesejoVotoParams): Promise<PutDesejoVotoModel> {
    const httpResponse = await this.httpClient.request<PutDesejoVotoModel>({
      url: this.url
        .replace(":id", params.id)
        .replace(":pessoaId", params.pessoaId),
      method: "put",
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
      case HttpStatusCode.created:
        return httpResponse.body;
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
