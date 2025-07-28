import React, { useMemo } from "react";

import { ResumoPorCategoriaTableProps } from "./resumoPorCategoriaTable.types";
import { formatMonth, getColumns } from "./resumoPorCategoriaTable.definitions";
import { Table } from "@/presentation/components";
import { Box } from "@rarui-react/components";

interface LinhaFixa {
  categoria: string;
  cor: string;
}

type LinhaTabela = LinhaFixa & {
  [mesFormatado: string]: number | string;
};

export const ResumoPorCategoriaTable: React.FC<
  ResumoPorCategoriaTableProps
> = ({ despesasCategoriasMes, despesasCategoriasAno, isLoading }) => {
  const rows = useMemo(() => {
    const categoriasMap = new Map<string, LinhaTabela>();

    // Preencher meses
    despesasCategoriasMes.forEach(({ mes, categorias }) => {
      const mesFormatado = formatMonth(mes); // Ex: "jul"

      categorias.forEach(({ categoria, valor, cor }) => {
        if (!categoriasMap.has(categoria)) {
          categoriasMap.set(categoria, { categoria, cor });
        }

        const row = categoriasMap.get(categoria)!;
        row[mesFormatado] = ((row[mesFormatado] as number) || 0) + valor;
      });
    });

    // Preencher coluna "ano"
    despesasCategoriasAno.forEach(({ categoria, valor }) => {
      const row = categoriasMap.get(categoria);
      if (row) {
        row["ano"] = valor;
      }
    });

    return Array.from(categoriasMap.values());
  }, [despesasCategoriasMes, despesasCategoriasAno]);

  return (
    <Box display="flex" alignItems="center" width="100%" height="100%">
      <Table
        columns={getColumns()}
        rows={rows ?? []}
        total={12}
        showPagination={false}
        isLoading={isLoading}
        tableContainerStyles={{ minHeight: "auto" }}
      />
    </Box>
  );
};

export default ResumoPorCategoriaTable;
