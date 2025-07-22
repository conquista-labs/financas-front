import type { NavigateFunction } from "react-router-dom";
import { IconButton, Text, Box, Tooltip } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";
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

export const getColumns = (
  navigate: NavigateFunction,
  mutate: UseMutateFunction<
    DeleteTransacoesIdModel,
    AxiosError<unknown, any>,
    DeleteTransacoesIdParams,
    unknown
  >,
) =>
  new ColumnsDefinitions<any>()
    .setColum("Categoria", "categoria", {
      formatter: (field: Categoria) => (
        <Box display="flex" justifyContent="center">
          <div className="categorie-badge" style={{ background: field.cor }}>
            {field.nome}
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
        <Tooltip
          position="right"
          content={<Text color="$primary">{row.observacoes}</Text>}
        >
          <Text color="$primary" fontSize="$xs">
            {field}
          </Text>
        </Tooltip>
      ),
    })
    .setColum("Pessoa", "pessoa", {
      formatter: (field: Pessoa) => (
        <Text color="$primary" fontSize="$xs">
          {field.nome}
        </Text>
      ),
    })
    .setColum("Meio de Pagamento", "meioPagamento", {
      formatter: (field: MeioPagamento) => (
        <Text color="$primary" fontSize="$xs">
          {field.nome}
        </Text>
      ),
    })
    .setColum("Forma Pagamento", "formaPagamento")
    .setColum("Valor", "valor")
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
            onClick={() => mutate({ id: field })}
          />
        </Box>
      ),
      boxProps: {
        width: "100px",
        textAlign: "center",
      },
    });
