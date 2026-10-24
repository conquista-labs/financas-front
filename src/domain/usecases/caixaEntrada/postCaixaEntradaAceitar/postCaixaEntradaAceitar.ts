import type { AceitarLancamentosRequest, AceitarLancamentosResponse } from "@/domain/models";

/** POST /caixa-entrada/aceitar — vira Transacao (ou marca a conta recorrente como paga). */
export interface PostCaixaEntradaAceitarUseCase {
  post: (params: PostCaixaEntradaAceitarParams) => Promise<PostCaixaEntradaAceitarModel>;
}

export type PostCaixaEntradaAceitarModel = AceitarLancamentosResponse;

export type PostCaixaEntradaAceitarParams = AceitarLancamentosRequest;
