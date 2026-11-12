import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import type { PostRecorrenciasRequest } from "@/domain/usecases";

import { PostRecorrencias } from "./postRecorrencias";

const url = "http://api.test/recorrencias";
const body: PostRecorrenciasRequest = {
  descricao: "Aluguel",
  valor: 2800,
  diaVencimento: 5,
  categoriaId: "cat-1",
};

const makeSut = (statusCode: HttpStatusCode, responseBody: unknown = {}) => {
  const httpClient: HttpClient = {
    request: vi.fn().mockResolvedValue({ statusCode, body: responseBody }),
  };
  return { sut: new PostRecorrencias(url, httpClient), httpClient };
};

describe("PostRecorrencias", () => {
  it("faz POST na url com o body", async () => {
    const { sut, httpClient } = makeSut(HttpStatusCode.created);
    await sut.post(body);
    expect(httpClient.request).toHaveBeenCalledWith({
      url,
      method: "post",
      body,
    });
  });

  it("retorna o body quando a API responde 201", async () => {
    const response = { message: "ok", data: { id: "rec-1", ...body } };
    const { sut } = makeSut(HttpStatusCode.created, response);
    await expect(sut.post(body)).resolves.toEqual(response);
  });

  it("lança InvalidCredentialsError em 401", async () => {
    const { sut } = makeSut(HttpStatusCode.unauthorized);
    await expect(sut.post(body)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("lança UnexpectedError nos outros status", async () => {
    const { sut } = makeSut(HttpStatusCode.serverError);
    await expect(sut.post(body)).rejects.toBeInstanceOf(UnexpectedError);
  });
});
