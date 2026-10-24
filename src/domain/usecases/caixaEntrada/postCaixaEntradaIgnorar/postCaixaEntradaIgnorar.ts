import type { IgnorarLancamentosRequest, IgnorarLancamentosResponse } from "@/domain/models";

/** POST /caixa-entrada/ignorar — descarta (opcionalmente sempre). */
export interface PostCaixaEntradaIgnorarUseCase {
  post: (params: PostCaixaEntradaIgnorarParams) => Promise<PostCaixaEntradaIgnorarModel>;
}

export type PostCaixaEntradaIgnorarModel = IgnorarLancamentosResponse;

export type PostCaixaEntradaIgnorarParams = IgnorarLancamentosRequest;
