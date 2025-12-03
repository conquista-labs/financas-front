import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Box, IconButton, Status } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";

import { ColumnsDefinitions } from "@/presentation/components";
import { urlRouters } from "@/presentation/router/router.definitions";
import { DeletePatrimonioIdParams } from "@/domain/usecases";

export const getColumns = (
  navigate: (path: string) => void,
  mutate: UseMutateFunction<
    void,
    AxiosError<unknown, any>,
    DeletePatrimonioIdParams,
    unknown
  >,
  refetch: () => void,
) =>
  new ColumnsDefinitions<any>()

    .setColum("Tipo", "tipoFormatado", {
      formatter: (field) => {
        const isPassive = field === "Passivo";
        return (
          <Box display="flex" justifyContent="center">
            <Status
              size="small"
              dot={false}
              appearance={isPassive ? "danger" : "success"}
            >
              {field}
            </Status>
          </Box>
        );
      },
      boxProps: {
        width: "100px",
        textAlign: "center",
      },
    })
    .setColum("Categoria", "categoriaFormatada")
    .setColum("Descrição", "descricao")
    .setColum("Data de aquisição", "dataAquisicao")
    .setColum("Valor inicial", "valorInicial")
    .setColum("Valor atual", "valorAtual")
    .setColum("Ações", "id", {
      formatter: (field) => (
        <Box display="flex" gap="$3xs">
          <IconButton
            variant="tonal"
            source={<EditFilledIcon />}
            onClick={() =>
              navigate(urlRouters.editPatrimony.replace(":id", field))
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
