import type { NavigateFunction } from "react-router-dom";
import { IconButton, Box } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  DeleteMeiosPagamentoIdModel,
  DeleteMeiosPagamentoIdParams,
} from "@/domain/usecases";

import { urlRouters } from "@/presentation/router/router.definitions";
import { ColumnsDefinitions } from "@/presentation/components";

export const getColumns = (
  navigate: NavigateFunction,
  mutate: UseMutateFunction<
    DeleteMeiosPagamentoIdModel,
    AxiosError<unknown, any>,
    DeleteMeiosPagamentoIdParams,
    unknown
  >,
) =>
  new ColumnsDefinitions<any>()
    .setColum("Nome", "nome")
    .setColum("Ações", "id", {
      formatter: (field) => (
        <Box display="flex" gap="$3xs">
          <IconButton
            variant="tonal"
            source={<EditFilledIcon />}
            onClick={() =>
              navigate(urlRouters.editMeansOfPayment.replace(":id", field))
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
