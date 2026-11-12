import type { LancamentoExterno } from "@/domain/models";

import { categoriaDe } from "./revisar.helpers";

const lanc = (extra: Partial<LancamentoExterno>) =>
  ({
    id: "1",
    tipo: "despesa",
    categoriaSugerida: null,
    ...extra,
  }) as LancamentoExterno;

describe("categoriaDe", () => {
  it("usa a sugerida quando é do mesmo tipo", () => {
    expect(
      categoriaDe(
        lanc({
          categoriaSugerida: { id: "casa", nome: "Casa", tipo: "despesa" },
        }),
      ),
    ).toBe("casa");
  });

  it("ignora sugestão de outro tipo (receita com categoria de despesa)", () => {
    expect(
      categoriaDe(
        lanc({
          tipo: "receita",
          categoriaSugerida: { id: "casa", nome: "Casa", tipo: "despesa" },
        }),
      ),
    ).toBe("");
  });

  it("a escolhida vence a sugerida", () => {
    expect(
      categoriaDe(
        lanc({
          categoriaSugerida: { id: "casa", nome: "Casa", tipo: "despesa" },
        }),
        { categoriaId: "mercado" },
      ),
    ).toBe("mercado");
  });
});
