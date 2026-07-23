import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type {
  PostImportacoesAnalisarModel,
  PostImportacoesAnalisarParams,
  PostImportacoesAnalisarUseCase,
} from "@/domain/usecases";

export class PostImportacoesAnalisar implements PostImportacoesAnalisarUseCase {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient,
  ) {}

  async analisar(
    params: PostImportacoesAnalisarParams,
  ): Promise<PostImportacoesAnalisarModel> {
    const formData = new FormData();
    formData.append("file", params.file);

    // FormData como body: o axios detecta e define o Content-Type
    // multipart/form-data com boundary automaticamente.
    const httpResponse =
      await this.httpClient.request<PostImportacoesAnalisarModel>({
        url: this.url,
        method: "post",
        body: formData,
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
