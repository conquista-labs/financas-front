import type { IgnorarParecidasResponse } from "@/domain/models";

/** POST /caixa-entrada/ignorar-parecidas — ignora de uma vez as que parecem já lançadas. */
export interface PostCaixaEntradaIgnorarParecidasUseCase {
  post: () => Promise<PostCaixaEntradaIgnorarParecidasModel>;
}

export type PostCaixaEntradaIgnorarParecidasModel = IgnorarParecidasResponse;
