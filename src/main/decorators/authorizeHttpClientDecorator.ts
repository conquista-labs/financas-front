import {
  type HttpClient,
  type HttpRequest,
  type HttpResponse,
  HttpStatusCode,
} from "@/data/protocols/http";
import type { AuthProvider } from "@/domain/protocols";
//TODO: Remove essa dependência para um inject
import {
  navigateTo,
  urlRouters,
} from "@/presentation/router/router.definitions";

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly authProvider: AuthProvider,
  ) {}

  async request<T>(data: HttpRequest): Promise<HttpResponse<T>> {
    const auth = this.authProvider.getAuth();

    if (auth.token) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          Authorization: `Bearer ${auth?.token ?? "test"}`,
        }),
      });
    }

    const httpResponse = await this.httpClient.request<T>(data);

    switch (httpResponse.statusCode) {
      case HttpStatusCode.unauthorized:
        this.redirectAndLogout();
        return httpResponse;
      default:
        return httpResponse;
    }
  }

  private redirectAndLogout() {
    navigateTo(urlRouters.login);
    //TODO: remover esse setTimeout
    setTimeout(() => {
      this.authProvider.resetAuth();
    }, 50);
  }
}
