import type { DesvincularLancamentosRequest, DesvincularLancamentosResponse } from "@/domain/models";

/** POST /caixa-entrada/desvincular — desfaz vínculos automáticos com o que já estava lançado. */
export interface PostCaixaEntradaDesvincularUseCase {
  post: (params: PostCaixaEntradaDesvincularParams) => Promise<PostCaixaEntradaDesvincularModel>;
}

export type PostCaixaEntradaDesvincularModel = DesvincularLancamentosResponse;

export type PostCaixaEntradaDesvincularParams = DesvincularLancamentosRequest;
