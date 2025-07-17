import type { NavigateFunction } from "react-router-dom";
import { IconButton, Status, Box } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  DeletePessoasIdModel,
  DeletePessoasIdParams,
} from "@/domain/usecases";

import { urlRouters } from "@/presentation/router/router.definitions";
import { ColumnsDefinitions } from "@/presentation/components";

export const getColumns = (
  navigate: NavigateFunction,
  mutate: UseMutateFunction<
    DeletePessoasIdModel,
    AxiosError<unknown, any>,
    DeletePessoasIdParams,
    unknown
  >,
) =>
  new ColumnsDefinitions<any>()
    .setColum("Status", "ativo", {
      formatter: (field) => (
        <Status dot={false} appearance={field ? "success" : "danger"}>
          {field ? "Ativo" : "Inativo"}
        </Status>
      ),
      boxProps: {
        width: "100px",
      },
    })
    .setColum("Nome", "nome")
    .setColum("Email", "email")
    .setColum("Ações", "id", {
      formatter: (field) => (
        <Box display="flex" gap="$3xs">
          <IconButton
            variant="tonal"
            source={<EditFilledIcon />}
            onClick={() =>
              navigate(urlRouters.editPeople.replace(":id", field))
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
      },
    });
