import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { usePostResumoFinanceiro } from "@/presentation/hooks/api";

import type { UseHomeDataParams, UseHomeDataReturn } from "./useHomeData.types";

export const useHomeData = ({ year }: UseHomeDataParams): UseHomeDataReturn => {
  const queryClient = useQueryClient();

  // Apenas o mutate para atualizar o resumo (usado no botão de refresh do Header)
  const { mutate: updateResumo, isPending: updatingResumo } =
    usePostResumoFinanceiro();

  // Estado de loading geral (apenas para o spinner principal)
  const isLoading = useMemo(() => updatingResumo, [updatingResumo]);

  // Função para forçar atualização de todos os dados
  const handleRefreshData = () => {
    updateResumo(
      { year },
      {
        onSuccess: () => {
          // Invalida todos os caches relacionados
          queryClient.invalidateQueries({
            queryKey: ["get", "resumo-financeiro"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "calendario"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "categorias"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "orcamento"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "meios-pagamento"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "quick-stats"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get", "analytics", "padroes-temporais"],
          });
          queryClient.invalidateQueries({
            queryKey: ["get-resumo-patrimonio"],
          });
        },
      },
    );
  };

  return {
    isLoading,
    handleRefreshData,
  };
};
