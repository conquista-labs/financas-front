import React, { useMemo } from "react";

import { ResumoMensalTableProps } from "./resumoMensalTable.types";
import { formatMonth, getColumns } from "./resumoMensalTable.definitions";
import { Table } from "@/presentation/components";
import { Box } from "@rarui-react/components";
import { TableFooter } from "./components";

export const ResumoMensalTable: React.FC<ResumoMensalTableProps> = ({
  receitas,
  despesas,
  totalReceitasAno,
  totalDespesasAno,
  isLoading,
}) => {
  const filterDespesas = despesas.filter((despesa) =>
    despesa.mes.includes("2025"),
  );
  const filterReceitas = receitas.filter((receita) =>
    receita.mes.includes("2025"),
  );

  const rows = useMemo(() => {
    const mesesSet = new Set([
      ...filterDespesas.map((r) => r.mes),
      ...filterReceitas.map((d) => d.mes),
    ]);
    const mesesOrdenados = Array.from(mesesSet).sort();

    return mesesOrdenados.map((mes) => {
      const receitaMes = receitas.find((r) => r.mes === mes)?.valor || 0;
      const despesaMes = despesas.find((d) => d.mes === mes)?.valor || 0;
      const saldo = receitaMes - despesaMes;

      return {
        mes: formatMonth(mes), // ex: "jan/2025"
        receita: receitaMes,
        despesa: despesaMes,
        saldo,
      };
    });
  }, [filterReceitas, filterReceitas]);

  return (
    <Box display="flex" alignItems="center" width="100%" height="100%">
      <Table
        columns={getColumns()}
        rows={rows ?? []}
        total={12}
        showPagination={false}
        isLoading={isLoading}
        tableContainerStyles={{ minHeight: "auto" }}
      >
        <TableFooter
          totalReceitasAno={totalReceitasAno}
          totalDespesasAno={totalDespesasAno}
        />
      </Table>
    </Box>
  );
};
export default ResumoMensalTable;
