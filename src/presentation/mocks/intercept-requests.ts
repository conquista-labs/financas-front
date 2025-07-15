import { act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { HttpStatusCode } from "@/data/protocols/http";
import type { ApiKey } from "@/main/factories/http";
import { makeApiUrl } from "@/main/factories/http";

import { server } from "./mock-nodejs";

export class MswInterceptor {
  private readonly apiUrl: string;

  constructor(apiKey: ApiKey = "DEFAULT", dynamicRoute: boolean = false) {
    this.apiUrl = makeApiUrl("", apiKey, dynamicRoute);
  }

  /**
   * Configura uma interceptação de requisição HTTP.
   * @param path Caminho relativo da API.
   * @param method Método HTTP a ser interceptado.
   * @param mockedResponse Resposta simulada para a requisição.
   * @param status Código de status HTTP.
   */
  intercept(
    path: string,
    method: "get" | "all" | "post" | "put" | "delete" | "patch" = "get",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedResponse: any = { message: "", data: "" },
    status: number = HttpStatusCode.ok,
  ): void {
    server.use(
      http[method](`${this.apiUrl}${path}`, () => {
        if (status === HttpStatusCode.ok || status === HttpStatusCode.created) {
          return HttpResponse.json({ data: mockedResponse }, { status });
        }
        return new HttpResponse(null, { status });
      }),
    );
  }

  /**
   * Aguarda uma requisição específica ser interceptada e resolvida.
   * @param method Método HTTP.
   * @param path Caminho relativo da requisição.
   */
  async wait(method: string, path: string): Promise<void> {
    let intercepted = false;

    const handler = ({ request }: { request: Request }) => {
      const matchesMethod =
        request.method.toUpperCase() === method.toUpperCase();
      const matchesPath = request.url.includes(path);

      if (matchesMethod && matchesPath) {
        intercepted = true;
        server.events.removeListener("response:mocked", handler);
      }
    };

    server.events.on("response:mocked", handler);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    await waitFor(() => {
      expect(intercepted).toBeTruthy();
    });
  }
}
