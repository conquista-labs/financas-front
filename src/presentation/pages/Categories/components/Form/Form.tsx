import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card } from "@rarui-react/components";
import { useNavigate } from "react-router-dom";

import { ColorPicker, Input, Select } from "@/presentation/components";

import { defaultForm, schema, tipoCategoriaOptions } from "./form.definitions";
import type { FormProps } from "./form.types";
import { urlRouters } from "@/presentation/router/router.definitions";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...defaultValues },
    mode: "onChange",
  });

  return (
    <Box display="flex" flexDirection="column" gap="$md">
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
            <Input
              label="Nome"
              name="nome"
              id="nome"
              placeholder="Digite o nome"
              control={control}
            />
            <Box display="flex" gap="$2xs" width="100%">
              <Select
                id="tipo"
                label="Tipo"
                name="tipo"
                placeholder="Selecione o tipo"
                control={control}
                options={tipoCategoriaOptions}
              />
              <ColorPicker label="Cor" name="cor" control={control} />
            </Box>
          </Box>
        </Card>

        <Box display="flex" justifyContent="space-between">
          <Button
            type="button"
            appearance="danger"
            variant="outlined"
            onClick={() => navigate(urlRouters.categories)}
          >
            Cancelar
          </Button>
          <Button disabled={isPending}>Salvar</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
