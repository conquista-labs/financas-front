import { Box, Card, Text, Title } from "@rarui-react/components";
import React from "react";
import { TopCategoriasCardProps } from "./topCategoriasCard.types";
import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

const TopCategoriasCard: React.FC<TopCategoriasCardProps> = ({
  categorias = [],
  totalGeral,
  isLoading = false,
  title = "Top Categorias",
}) => {
  if (isLoading) {
    return (
      <Card>
        <Card.Body>
          <Box
            padding="$s"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Text color="$secondary">Carregando...</Text>
          </Box>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <Card.Body>
        <Box padding="$s" display="flex" flexDirection="column" gap="$s">
          <Title as="h6" color="$secondary" textAlign="center">
            {title}
          </Title>

          <Box display="flex" flexDirection="column" gap="$xs">
            {categorias.map((categoria, index) => (
              <Box
                key={categoria.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="$xs"
                borderRadius="$xs"
                backgroundColor="$background"
                borderWidth="$1"
                borderStyle="solid"
                borderColor="$secondary"
              >
                {/* Ranking + Ícone + Nome */}
                <Box display="flex" alignItems="center" gap="$xs" flex="1">
                  <div
                    style={{
                      backgroundColor: categoria.cor,
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "100%",
                    }}
                  >
                    <Text fontSize="$xs" fontWeight="$bold" color="$primary">
                      {index + 1}
                    </Text>
                  </div>

                  <Box display="flex" flexDirection="column">
                    <Text fontSize="$s" fontWeight="$medium" color="$primary">
                      {categoria.nome}
                    </Text>
                    <Text fontSize="$xs" color="$secondary">
                      {categoria.numeroTransacoes} transações
                    </Text>
                  </Box>
                </Box>

                {/* Valores e Progresso */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                  gap="$4xs"
                  minWidth="120px"
                >
                  <Text fontSize="$s" fontWeight="$bold" color="$primary">
                    {formatCurrency(categoria.valorTotal)}
                  </Text>
                  <Text fontSize="$xs" color="$secondary">
                    {categoria.percentualDoTotal.toFixed(1)}% do total
                  </Text>

                  {/* Alerta de teto */}
                  {categoria.tetoUltrapassado && (
                    <Box display="flex" alignItems="center" gap="$4xs">
                      <Text fontSize="$xxs" color="$error">
                        ⚠️ Teto: {categoria.percentualTeto.toFixed(0)}%
                      </Text>
                    </Box>
                  )}

                  {/* Variação mês anterior */}
                  {categoria.mesAnterior &&
                    categoria.mesAnterior.variacao !== 0 && (
                      <Text
                        fontSize="$xxs"
                        color={
                          categoria.mesAnterior.variacao > 0
                            ? "$error"
                            : "$success"
                        }
                      >
                        {categoria.mesAnterior.variacao > 0 ? "↗️" : "↙️"}{" "}
                        {Math.abs(categoria.mesAnterior.variacao).toFixed(1)}%
                      </Text>
                    )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Total Geral */}
          {totalGeral && (
            <Box
              marginTop="$s"
              padding="$xs"
              borderRadius="$xs"
              backgroundColor="$brand"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="$s" color="$on-brand" fontWeight="$medium">
                Total Geral
              </Text>
              <Text fontSize="$s" color="$on-brand" fontWeight="$bold">
                {formatCurrency(totalGeral)}
              </Text>
            </Box>
          )}
        </Box>
      </Card.Body>
    </Card>
  );
};

export default TopCategoriasCard;
