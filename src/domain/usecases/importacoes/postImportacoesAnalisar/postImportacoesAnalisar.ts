import type { AnalisarResponse } from "@/domain/models";

/**
 * POST /importacoes/analisar — envia o arquivo do extrato (PDF/imagem/CSV/OFX)
 * como multipart e recebe as linhas detectadas + resumo da análise.
 */
export interface PostImportacoesAnalisarUseCase {
  analisar: (
    param: PostImportacoesAnalisarParams,
  ) => Promise<PostImportacoesAnalisarModel>;
}

export type PostImportacoesAnalisarModel = AnalisarResponse;
export type PostImportacoesAnalisarParams = { file: File };
