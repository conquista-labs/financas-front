import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";

import { PostTransacoesPagarLote } from "./postTransacoesPagarLote";

const url = "http://api.test/transacoes/pagar-lote";
const body = { ate: "2026-10-31" };

const makeSut = (statusCode: HttpStatusCode, responseBody: unknown = {}) => {
  const httpClient: HttpClient = {
    request: vi.fn().mockResolvedValue({ statusCode, body: responseBody }),
  };
  return { sut: new PostTransacoesPagarLote(url, httpClient), httpClient };
};

describe("PostTransacoesPagarLote", () => {
  it("faz POST na url com o body", async () => {
    const { sut, httpClient } = makeSut(HttpStatusCode.created);
    await sut.pagarLote(body);
    expect(httpClient.request).toHaveBeenCalledWith({
      url,
      method: "post",
      body,
    });
  });

  it("retorna o body quando a API responde 201", async () => {
    const response = { message: "ok", data: { pagas: 12 } };
    const { sut } = makeSut(HttpStatusCode.created, response);
    await expect(sut.pagarLote(body)).resolves.toEqual(response);
  });

  it("lança InvalidCredentialsError em 401", async () => {
    const { sut } = makeSut(HttpStatusCode.unauthorized);
    await expect(sut.pagarLote(body)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("lança UnexpectedError nos outros status", async () => {
    const { sut } = makeSut(HttpStatusCode.serverError);
    await expect(sut.pagarLote(body)).rejects.toBeInstanceOf(UnexpectedError);
  });
});
