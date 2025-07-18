import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card } from "@rarui-react/components";
import { useNavigate } from "react-router-dom";

import { urlRouters } from "@/presentation/router/router.definitions";
import { useIsMobile } from "@/presentation/hooks/core";
import { Input, Loading } from "@/presentation/components";

import { defaultForm, schema } from "./form.definitions";
import type { FormProps } from "./form.types";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...defaultValues },
    mode: "onChange",
  });

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
            <Input
              label="Nome"
              name="nome"
              id="nome"
              placeholder="Digite o nome"
              control={control}
            />
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
            onClick={() => navigate(urlRouters.meansOfPayment)}
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
