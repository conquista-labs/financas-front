import type { NavigateFunction } from "react-router-dom";
import { IconButton, Status, Box } from "@rarui-react/components";
import { EditFilledIcon, TrashFilledIcon } from "@rarui/icons";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  DeleteCategoriasIdModel,
  DeleteCategoriasIdParams,
} from "@/domain/usecases";

import { urlRouters } from "@/presentation/router/router.definitions";
import { ColumnsDefinitions } from "@/presentation/components";

export const getColumns = (
  navigate: NavigateFunction,
  mutate: UseMutateFunction<
    DeleteCategoriasIdModel,
    AxiosError<unknown, any>,
    DeleteCategoriasIdParams,
    unknown
  >,
) =>
  new ColumnsDefinitions<any>()

    .setColum("Cor", "cor", {
      formatter: (field) => (
        <div
          style={{
            backgroundColor: field,
            height: "30px",
            width: "30px",
            borderRadius: "100%",
          }}
        />
      ),
      boxProps: {
        width: "30px",
        textAlign: "center",
      },
    })
    .setColum("Nome", "nome")
    .setColum("Tipo", "tipo", {
      formatter: (field) => {
        const isExpense = field === "despesa";
        return (
          <Box display="flex" justifyContent="center">
            <Status
              size="small"
              dot={false}
              appearance={isExpense ? "danger" : "success"}
            >
              {isExpense ? "Despesa" : "Receita"}
            </Status>
          </Box>
        );
      },
      boxProps: {
        width: "130px",
        textAlign: "center",
      },
    })
    .setColum("Ações", "id", {
      formatter: (field) => (
        <Box display="flex" gap="$3xs">
          <IconButton
            variant="tonal"
            source={<EditFilledIcon />}
            onClick={() =>
              navigate(urlRouters.editCategories.replace(":id", field))
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
