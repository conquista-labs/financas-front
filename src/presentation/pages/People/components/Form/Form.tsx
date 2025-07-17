import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card } from "@rarui-react/components";

import { Input, Toggle } from "@/presentation/components";

import { defaultForm, schema } from "./form.definitions";
import type { FormProps } from "./form.types";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    values: defaultValues ?? defaultForm,
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
            <Toggle name="ativo" label="Ativo" control={control} />
            <Input
              label="Nome"
              name="nome"
              id="nome"
              placeholder="Digite seu nome"
              control={control}
            />
            <Input
              label="E-mail"
              name="email"
              id="email"
              placeholder="Digite seu endereço de e-mail"
              control={control}
            />
          </Box>
        </Card>

        <Box display="flex" justifyContent="space-between">
          <Button type="button" appearance="danger" variant="outlined">
            Cancelar
          </Button>
          <Button disabled={isPending}>Salvar</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Form;
