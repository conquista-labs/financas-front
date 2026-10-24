import type { GetCaixaEntradaResponse } from "@/domain/models";

/** GET /caixa-entrada — lançamentos sincronizados (pendentes ou ignorados), paginados. */
export interface GetCaixaEntradaUseCase {
  get: (params: GetCaixaEntradaParams) => Promise<GetCaixaEntradaModel>;
}

export type GetCaixaEntradaModel = GetCaixaEntradaResponse;

export type GetCaixaEntradaParams = {
  page?: number;
  limit?: number;
  status?: "pendente" | "ignorado";
  pessoaId?: string;
  comDica?: boolean;
  busca?: string;
};
