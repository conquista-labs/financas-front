import { useMutation } from "@tanstack/react-query";

import type { PostImportacoesAnalisarParams } from "@/domain/usecases";
import { makePostImportacoesAnalisarFactory } from "@/main/factories/usecases";

/**
 * Envia o arquivo do extrato para análise e devolve as linhas detectadas +
 * resumo. É uma mutation porque dispara sob demanda (após o upload).
 */
export const useAnalisarImportacao = () => {
  const analisar = makePostImportacoesAnalisarFactory();

  return useMutation({
    mutationKey: ["post-importacoes-analisar"],
    mutationFn: (params: PostImportacoesAnalisarParams) =>
      analisar.analisar(params),
  });
};
