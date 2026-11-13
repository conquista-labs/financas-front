import { type HttpClient, HttpStatusCode } from "@/data/protocols";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";

import {
  DeleteRecorrenciasId,
  GetContasVinculadas,
  GetRecorrencias,
  PatchContasVinculadasId,
  PatchRecorrenciasId,
} from ".";

const cliente = (statusCode: HttpStatusCode, body: unknown = { ok: true }) => {
  const httpClient: HttpClient = {
    request: vi.fn().mockResolvedValue({ statusCode, body }),
  };
  return httpClient;
};

describe("use cases de Ajustes (recorrências e contas vinculadas)", () => {
  it("GetRecorrencias: GET na url", async () => {
    const http = cliente(HttpStatusCode.ok, { data: [] });
    await expect(
      new GetRecorrencias("/recorrencias", http).get(),
    ).resolves.toEqual({ data: [] });
    expect(http.request).toHaveBeenCalledWith({
      url: "/recorrencias",
      method: "get",
    });
  });

  it("PatchRecorrenciasId: troca :id e manda o body", async () => {
    const http = cliente(HttpStatusCode.ok);
    await new PatchRecorrenciasId("/recorrencias/:id", http).patch(
      { ativa: false },
      { id: "r1" },
    );
    expect(http.request).toHaveBeenCalledWith({
      url: "/recorrencias/r1",
      method: "patch",
      body: { ativa: false },
    });
  });

  it("DeleteRecorrenciasId: DELETE com :id", async () => {
    const http = cliente(HttpStatusCode.ok);
    await new DeleteRecorrenciasId("/recorrencias/:id", http).delete({
      id: "r1",
    });
    expect(http.request).toHaveBeenCalledWith({
      url: "/recorrencias/r1",
      method: "delete",
    });
  });

  it("GetContasVinculadas e PatchContasVinculadasId", async () => {
    const http = cliente(HttpStatusCode.ok);
    await new GetContasVinculadas("/contas-vinculadas", http).get();
    await new PatchContasVinculadasId("/contas-vinculadas/:id", http).patch(
      { ativa: true, pessoaId: "p1" },
      { id: "c1" },
    );
    expect(http.request).toHaveBeenLastCalledWith({
      url: "/contas-vinculadas/c1",
      method: "patch",
      body: { ativa: true, pessoaId: "p1" },
    });
  });

  it("401 vira InvalidCredentialsError; outros status, UnexpectedError", async () => {
    await expect(
      new GetRecorrencias("/r", cliente(HttpStatusCode.unauthorized)).get(),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    await expect(
      new PatchContasVinculadasId(
        "/c/:id",
        cliente(HttpStatusCode.badRequest),
      ).patch({ ativa: true }, { id: "c1" }),
    ).rejects.toBeInstanceOf(UnexpectedError);
    await expect(
      new DeleteRecorrenciasId(
        "/r/:id",
        cliente(HttpStatusCode.serverError),
      ).delete({ id: "x" }),
    ).rejects.toBeInstanceOf(UnexpectedError);
  });
});
