import React, { useMemo, useState } from "react";

import { ResumoPorCategoriaTableProps } from "./resumoPorCategoriaTable.types";
import { formatMonth, getColumns } from "./resumoPorCategoriaTable.definitions";
import { Table, TableSkeleton } from "@/presentation/components";
import { Box, Title, Button, Text } from "@rarui-react/components";

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
> = ({
  despesasPorCategoriaMes,
  despesasPorCategoriaAno,
  isLoading = false,
}) => {
  const [isCompactMode, setIsCompactMode] = useState(true);
  const MINIMUM_VALUE_FILTER = 100; // R$ 100 mínimo
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

    let allRows = Array.from(categoriasMap.values());

    // Ordenação dinâmica por valor total decrescente
    allRows.sort((a, b) => {
      const valorA = (a.ano as number) || 0;
      const valorB = (b.ano as number) || 0;
      return valorB - valorA;
    });

    // Filtro inteligente em modo compacto
    if (isCompactMode) {
      const mainCategories = allRows.filter(
        (row) => (row.ano as number) >= MINIMUM_VALUE_FILTER,
      );

      const smallCategories = allRows.filter(
        (row) =>
          (row.ano as number) < MINIMUM_VALUE_FILTER && (row.ano as number) > 0,
      );

      // Agrupamento "Outros" para categorias pequenas
      if (smallCategories.length > 0) {
        const outrosRow: LinhaTabela = {
          categoria: "Outros",
          cor: "#9CA3AF", // Cor cinza para agrupamento
          ano: smallCategories.reduce(
            (sum, row) => sum + ((row.ano as number) || 0),
            0,
          ),
        };

        // Somar valores mensais das categorias pequenas
        smallCategories.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (
              key !== "categoria" &&
              key !== "cor" &&
              key !== "ano" &&
              typeof row[key] === "number"
            ) {
              outrosRow[key] =
                ((outrosRow[key] as number) || 0) + (row[key] as number);
            }
          });
        });

        return [...mainCategories, outrosRow];
      }

      return mainCategories;
    }

    return allRows;
  }, [despesasPorCategoriaMes, despesasPorCategoriaAno, isCompactMode]);

  const allCategoriesCount = useMemo(() => {
    const categoriasMap = new Map<string, number>();
    despesasPorCategoriaAno.forEach(({ categoria, valor }) => {
      if (valor > 0) categoriasMap.set(categoria, valor);
    });
    return categoriasMap.size;
  }, [despesasPorCategoriaAno]);

  const mainCategoriesCount = rows.filter(
    (row) => row.categoria !== "Outros",
  ).length;
  const hasOtros = rows.some((row) => row.categoria === "Outros");

  if (isLoading) {
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
        <TableSkeleton rows={8} columns={6} />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="100%"
      flexDirection="column"
      gap="$2xs"
    >
      {/* Header com título e controles */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Title as="h6" color="$secondary">
          Despesas por Categoria
        </Title>

        <Box display="flex" alignItems="center" gap="$xs">
          <Text fontSize="$xs" color="$secondary">
            {isCompactMode
              ? `${mainCategoriesCount} principais${hasOtros ? " + outros" : ""}`
              : `${allCategoriesCount} categorias`}
          </Text>
          <Button
            variant="tonal"
            size="small"
            onClick={() => setIsCompactMode(!isCompactMode)}
          >
            {isCompactMode ? "Ver Todas" : "Compacto"}
          </Button>
        </Box>
      </Box>

      {/* Informação sobre filtro em modo compacto */}
      {isCompactMode && (
        <Box width="100%" paddingBottom="$xs">
          <Text fontSize="$xs" color="$secondary" textAlign="center">
            💡 Mostrando categorias com gastos ≥ R${" "}
            {MINIMUM_VALUE_FILTER.toLocaleString("pt-BR")}
          </Text>
        </Box>
      )}

      <Table
        columns={getColumns()}
        rows={rows ?? []}
        total={12}
        showPagination={false}
        tableContainerStyles={{ maxHeight: "700px" }}
      />
    </Box>
  );
};

export default ResumoPorCategoriaTable;
