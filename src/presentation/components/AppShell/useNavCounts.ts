import { addDays, format } from "date-fns";

import {
  useGetCaixaEntradaResumo,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { useExtratoPendentes } from "@/presentation/store/filaExtrato";

import type { NavBadge } from "./appShell.definitions";

/**
 * Contadores da navegação (sidebar, barra mobile e "Mais"):
 * - revisar: pendentes do banco + linhas de extrato esperando no navegador;
 * - agenda: contas atrasadas + que vencem nos próximos 7 dias (mesmo critério
 *   do "Pede atenção").
 */
export const useNavCounts = (): Record<NavBadge, number | undefined> => {
  // Atualiza a cada 2 min e ao voltar à aba.
  const { data: resumo } = useGetCaixaEntradaResumo({
    refetchInterval: 2 * 60 * 1000,
  });
  const extratoPendentes = useExtratoPendentes();
  // limit 1: só o total da paginação importa.
  const hojeISO = format(new Date(), "yyyy-MM-dd");
  const { data: atrasadas } = useGetTransacoes({
    page: 1,
    limit: 1,
    status: "atrasada",
  });
  const { data: proximas } = useGetTransacoes({
    page: 1,
    limit: 1,
    status: "pendente",
    startDate: hojeISO,
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
  });
  return {
    revisar: (resumo?.data.pendentes ?? 0) + extratoPendentes,
    agenda:
      (atrasadas?.data?.meta?.total ?? 0) + (proximas?.data?.meta?.total ?? 0),
  };
};
