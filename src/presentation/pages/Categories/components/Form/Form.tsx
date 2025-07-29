import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card, Text } from "@rarui-react/components";
import { useNavigate } from "react-router-dom";

import { urlRouters } from "@/presentation/router/router.definitions";
import { useIsMobile } from "@/presentation/hooks/core";
import {
  ColorPicker,
  Input,
  InputCurrency,
  Loading,
  Select,
} from "@/presentation/components";

import { Categoria } from "@/domain/models";
import { defaultForm, schema, tipoCategoriaOptions } from "./form.definitions";

import type { FormProps } from "./form.types";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();

  const { handleSubmit, watch, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...defaultValues },
    mode: "onChange",
  });

  const isExpense = watch("tipo") == Categoria.TipoEnum.Despesa;

  return (
    <Box display="flex" flexDirection="column" gap="$md" width="100%">
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap="$s"
      >
        <Card>
          <Box
            display="flex"
            flexDirection="column"
            gap="$s"
            alignItems="flex-end"
          >
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <Input
                label="Nome"
                name="nome"
                id="nome"
                placeholder="Digite o nome"
                control={control}
              />
              <Select
                id="tipo"
                label="Tipo"
                name="tipo"
                placeholder="Selecione o tipo"
                control={control}
                options={tipoCategoriaOptions}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent="flex-end"
              gap="$s"
              width="100%"
            >
              {isExpense && (
                <InputCurrency
                  label="Teto de gasto"
                  name="tetoGasto"
                  id="tetoGasto"
                  placeholder="Digite o valor do teto de gasto"
                  control={control}
                  leadingStart={<Text>R$</Text>}
                />
              )}
              <ColorPicker label="Cor" name="cor" control={control} />
            </Box>
          </Box>
        </Card>

        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: "column", md: "row" }}
          gap="$2xs"
        >
          <Button
            type="button"
            appearance="danger"
            variant="outlined"
            onClick={() => navigate(urlRouters.categories)}
            full={isMobile}
          >
            Cancelar
          </Button>
          <Button disabled={isPending} full={isMobile}>
            Salvar
          </Button>
        </Box>
      </Box>
      <Loading isLoading={isPending} />
    </Box>
  );
};

export default Form;
