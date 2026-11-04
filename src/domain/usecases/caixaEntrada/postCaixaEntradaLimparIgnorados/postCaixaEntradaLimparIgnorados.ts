import type { ExcluirLancamentosResponse } from "@/domain/models";

/** POST /caixa-entrada/limpar-ignorados — exclui de uma vez tudo que está em Ignorados. */
export interface PostCaixaEntradaLimparIgnoradosUseCase {
  post: () => Promise<PostCaixaEntradaLimparIgnoradosModel>;
}

export type PostCaixaEntradaLimparIgnoradosModel = ExcluirLancamentosResponse;
