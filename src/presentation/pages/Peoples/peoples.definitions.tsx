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
  navigate: (path: string) => void,
  mutate: UseMutateFunction<
    DeletePessoasIdModel,
    AxiosError<unknown, any>,
    DeletePessoasIdParams,
    unknown
  >,
  refetch: () => void,
) =>
  new ColumnsDefinitions<any>()
    .setColum("Status", "ativo", {
      formatter: (field) => (
        <Box display="flex" justifyContent="center">
          <Status
            size="small"
            dot={false}
            appearance={field ? "success" : "danger"}
          >
            {field ? "Ativo" : "Inativo"}
          </Status>
        </Box>
      ),
      boxProps: {
        width: "100px",
        textAlign: "center",
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
              navigate(urlRouters.editPeoples.replace(":id", field))
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
