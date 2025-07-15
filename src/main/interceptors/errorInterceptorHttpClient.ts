import {
  type HttpClient,
  type HttpRequest,
  type HttpResponse,
  HttpStatusCode,
} from "@/data/protocols/http";
import {
  navigateTo,
  urlRouters,
} from "@/presentation/router/router.definitions";

export class ErrorInterceptorHttpClient implements HttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async request<T>(data: HttpRequest): Promise<HttpResponse<T>> {
    const httpResponse = (await this.httpClient.request(
      data,
    )) as HttpResponse<T>;

    switch (httpResponse.statusCode) {
      case HttpStatusCode.serverError:
        //TODO: adicionar redirect para tela
        navigateTo(urlRouters.error);
        return httpResponse;
      default:
        return httpResponse;
    }
  }
}
