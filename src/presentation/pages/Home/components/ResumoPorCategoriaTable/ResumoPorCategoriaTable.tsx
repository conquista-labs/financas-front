import React, { useMemo } from "react";

import { ResumoPorCategoriaTableProps } from "./resumoPorCategoriaTable.types";
import { formatMonth, getColumns } from "./resumoPorCategoriaTable.definitions";
import { Table } from "@/presentation/components";
import { Box, Title } from "@rarui-react/components";

interface LinhaFixa {
  categoria: string;
  cor: string;
  tetoGasto?: number;
}

type LinhaTabela = LinhaFixa & {
  [mesFormatado: string]: number | string | undefined;
};

export const ResumoPorCategoriaTable: React.FC<
  ResumoPorCategoriaTableProps
> = ({ despesasPorCategoriaMes, despesasPorCategoriaAno }) => {
  const rows = useMemo(() => {
    const categoriasMap = new Map<string, LinhaTabela>();

    // Preencher meses
    despesasPorCategoriaMes.forEach(({ mes, categorias }) => {
      const mesFormatado = formatMonth(mes);

      categorias.forEach(({ categoria, valor, cor, tetoGasto }) => {
        if (!categoriasMap.has(categoria)) {
          categoriasMap.set(categoria, {
            categoria,
            cor,
            tetoGastoMes: tetoGasto,
          });
        }

        const row = categoriasMap.get(categoria)!;
        row[mesFormatado] = ((row[mesFormatado] as number) || 0) + valor;
      });
    });

    // Preencher coluna "ano"
    despesasPorCategoriaAno.forEach(({ categoria, valor, tetoGasto }) => {
      const row = categoriasMap.get(categoria);
      if (row) {
        row["ano"] = valor;
        row["tetoGastoAno"] = tetoGasto;
      }
    });

    return Array.from(categoriasMap.values());
  }, [despesasPorCategoriaMes, despesasPorCategoriaAno]);

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
        Despesas por Categoria
      </Title>
      <Table
        columns={getColumns()}
        rows={rows ?? []}
        total={12}
        showPagination={false}
        tableContainerStyles={{ minHeight: "auto" }}
      />
    </Box>
  );
};

export default ResumoPorCategoriaTable;
