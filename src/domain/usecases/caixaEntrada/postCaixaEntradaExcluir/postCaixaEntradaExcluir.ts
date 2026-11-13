import type {
  ExcluirLancamentosRequest,
  ExcluirLancamentosResponse,
} from "@/domain/models";

/** POST /caixa-entrada/excluir — some da caixa e não volta na sincronização. */
export interface PostCaixaEntradaExcluirUseCase {
  post: (
    params: PostCaixaEntradaExcluirParams,
  ) => Promise<PostCaixaEntradaExcluirModel>;
}

export type PostCaixaEntradaExcluirModel = ExcluirLancamentosResponse;

export type PostCaixaEntradaExcluirParams = ExcluirLancamentosRequest;
