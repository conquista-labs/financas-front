import type {
  RestaurarLancamentosRequest,
  RestaurarLancamentosResponse,
} from "@/domain/models";

/** POST /caixa-entrada/restaurar — volta ignorados para a caixa. */
export interface PostCaixaEntradaRestaurarUseCase {
  post: (
    params: PostCaixaEntradaRestaurarParams,
  ) => Promise<PostCaixaEntradaRestaurarModel>;
}

export type PostCaixaEntradaRestaurarModel = RestaurarLancamentosResponse;

export type PostCaixaEntradaRestaurarParams = RestaurarLancamentosRequest;
