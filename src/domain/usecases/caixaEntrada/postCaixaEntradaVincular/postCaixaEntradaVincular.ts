import type {
  VincularLancamentosRequest,
  VincularLancamentosResponse,
} from "@/domain/models";

/** POST /caixa-entrada/vincular — liga lançamentos a transações já lançadas. */
export interface PostCaixaEntradaVincularUseCase {
  post: (
    params: PostCaixaEntradaVincularParams,
  ) => Promise<PostCaixaEntradaVincularModel>;
}

export type PostCaixaEntradaVincularModel = VincularLancamentosResponse;

export type PostCaixaEntradaVincularParams = VincularLancamentosRequest;
