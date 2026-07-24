import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  DeleteTagsIdModel,
  DeleteTagsIdParams,
  DeleteTagsIdUseCase,
} from "@/domain/usecases";

export class DeleteTagsId implements DeleteTagsIdUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async delete(params: DeleteTagsIdParams): Promise<DeleteTagsIdModel> {
    const httpResponse = await this.httpClient.request<DeleteTagsIdModel>({
      url: `${this.url.replace(":id", params.id)}`,
      method: "delete",
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
