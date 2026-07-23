import type {
  ConfirmarImportacaoRequest,
  ConfirmarImportacaoResponse,
} from "@/domain/models";

/**
 * POST /importacoes/confirmar — persiste as linhas revisadas como transações,
 * aplicando opcionalmente uma tag em lote a todas elas.
 */
export interface PostImportacoesConfirmarUseCase {
  confirmar: (
    param: PostImportacoesConfirmarParams,
  ) => Promise<PostImportacoesConfirmarModel>;
}

export type PostImportacoesConfirmarModel = ConfirmarImportacaoResponse;
export type PostImportacoesConfirmarParams = ConfirmarImportacaoRequest;
