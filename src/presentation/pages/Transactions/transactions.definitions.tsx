import { IconButton, Text, Box, Tooltip } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";
import { differenceInCalendarDays } from "date-fns";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  DeleteTransacoesIdModel,
  DeleteTransacoesIdParams,
} from "@/domain/usecases";

import { urlRouters } from "@/presentation/router/router.definitions";
import { ColumnsDefinitions } from "@/presentation/components";
import { Categoria, MeioPagamento, Pessoa } from "@/domain/models";
import "./transactions.css";

export const isTwoDaysBeforeMonthEnd = (
  date: null | undefined | Date,
): boolean => {
  const diff = differenceInCalendarDays(date ?? new Date(), new Date());
  return false;
  return diff === 0 || diff === 1 || diff === 2;
};

export const getColumns = (
  navigate: (path: string) => void,
  mutate: UseMutateFunction<
    DeleteTransacoesIdModel,
    AxiosError<unknown, any>,
    DeleteTransacoesIdParams,
    unknown
  >,
  refetch: () => void,
) =>
  new ColumnsDefinitions<any>()
    .setColum("Categoria", "categoria", {
      formatter: (field: Categoria) => (
        <Box display="flex" justifyContent="center">
          <div className="categorie-badge" style={{ background: field?.cor }}>
            {field?.nome}
          </div>
        </Box>
      ),
      boxProps: {
        width: "150px",
        textAlign: "center",
      },
    })
    .setColum("Data", "data")
    .setColum("Descrição", "descricao", {
      formatter: (field, row) => (
        <>
          {row.observacoes ? (
            <Tooltip
              position="right"
              content={
                <Text color="$primary" fontSize="$s">
                  {row.observacoes}
                </Text>
              }
            >
              <Text color="$primary" fontSize="$s">
                {field}
              </Text>
            </Tooltip>
          ) : (
            <Text color="$primary" fontSize="$s">
              {field}
            </Text>
          )}
        </>
      ),
    })
    .setColum("Pessoa", "pessoa", {
      formatter: (field: Pessoa) => (
        <Text color="$primary" fontSize="$s">
          {field?.nome}
        </Text>
      ),
    })
    .setColum("Meio de Pagamento", "meioPagamento", {
      formatter: (field: MeioPagamento) => (
        <Text color="$primary" fontSize="$s">
          {field?.nome}
        </Text>
      ),
    })
    .setColum("Forma Pagamento", "formaPagamento")
    .setColum("Valor", "valor", {
      formatter: (field) => (
        <Text color="$primary" fontSize="$s" textAlign="center">
          {field}
        </Text>
      ),
      boxProps: { textAlign: "center" },
    })
    .setColum("Ações", "id", {
      formatter: (field) => (
        <Box display="flex" gap="$3xs">
          <IconButton
            variant="tonal"
            source={<EditFilledIcon />}
            onClick={() =>
              navigate(urlRouters.editTransactions.replace(":id", field))
            }
          />
          <IconButton
            appearance="danger"
            variant="tonal"
            source={<TrashFilledIcon />}
            onClick={() => mutate({ id: field }, { onSuccess: refetch })}
          />
        </Box>
      ),
      boxProps: {
        width: "100px",
        textAlign: "center",
      },
    });
