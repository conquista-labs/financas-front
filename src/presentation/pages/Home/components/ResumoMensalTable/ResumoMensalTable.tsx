import React, { useMemo } from "react";

import { ResumoMensalTableProps } from "./resumoMensalTable.types";
import { formatMonth, getColumns } from "./resumoMensalTable.definitions";
import { Table } from "@/presentation/components";
import { Box, Title } from "@rarui-react/components";
import { TableFooter } from "./components";

export const ResumoMensalTable: React.FC<ResumoMensalTableProps> = ({
  receitasMes,
  despesasMes,
  receitasAno,
  despesasAno,
  saldosMes,
  saldosMesAno,
}) => {
  const rows = useMemo(() => {
    const mesesSet = new Set([
      ...despesasMes.map((r) => r.mes),
      ...receitasMes.map((d) => d.mes),
      ...saldosMes.map((s) => s.mes),
    ]);

    const mesesOrdenados = Array.from(mesesSet).sort();

    return mesesOrdenados.map((mes) => {
      const receitaMes = receitasMes.find((r) => r.mes === mes)?.valor || 0;
      const despesaMes = despesasMes.find((d) => d.mes === mes)?.valor || 0;
      const saldoMesAnterior = saldosMes.find((s) => s.mes === mes)?.valor || 0;
      const saldo = receitaMes + saldoMesAnterior - despesaMes;

      return {
        mes: formatMonth(mes), // ex: "jan/2025"
        receita: receitaMes,
        despesa: despesaMes,
        saldo,
        saldoMesAnterior,
      };
    });
  }, [receitasMes, receitasMes, saldosMes]);

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="100%"
      flexDirection="column"
      gap="$2xs"
    >
      <Title as="h6" color="$secondary">
        Resumo de Receitas e Despesas
      </Title>
      <Table
        columns={getColumns()}
        rows={rows ?? []}
        total={12}
        showPagination={false}
        tableContainerStyles={{ minHeight: "auto" }}
      >
        <TableFooter
          receitasAno={receitasAno}
          despesasAno={despesasAno}
          saldosMesAno={saldosMesAno}
        />
      </Table>
    </Box>
  );
};
export default ResumoMensalTable;
