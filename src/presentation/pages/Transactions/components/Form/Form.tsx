import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card } from "@rarui-react/components";
import { useLocation, useNavigate } from "react-router-dom";

import { urlRouters } from "@/presentation/router/router.definitions";
import { useIsMobile } from "@/presentation/hooks/core";
import {
  DatePicker,
  Input,
  Loading,
  Select,
  Textarea,
} from "@/presentation/components";

import { buildOptions, defaultForm, schema } from "./form.definitions";
import type { FormProps } from "./form.types";
import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";
import { useMemo } from "react";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSearch = location.search;
  const { isMobile } = useIsMobile();
  const { data: EnumsData } = useGetEnums();
  const { data: categoriesData } = useGetCategorias({ page: 1, limit: 50 });
  const { data: peoplesData } = useGetPessoas({ page: 1, limit: 50 });
  const { data: meansOfPaymentData } = useGetMeiosPagamento({
    page: 1,
    limit: 50,
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...defaultValues },
    mode: "onChange",
  });

  const categories = useMemo(
    () => buildOptions(categoriesData?.data?.rows ?? []),
    [categoriesData?.data?.rows],
  );

  const peoples = useMemo(
    () => buildOptions(peoplesData?.data?.rows ?? []),
    [peoplesData?.data?.rows],
  );

  const meansOfPayment = useMemo(
    () => buildOptions(meansOfPaymentData?.data?.rows ?? []),
    [meansOfPaymentData?.data?.rows],
  );

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
              <Select
                label="Categoria"
                id="categoriaId"
                name="categoriaId"
                placeholder="Selecione a categoria"
                options={categories}
                control={control}
                maxHeight="300px"
              />
              <Select
                label="Pessoa"
                id="pessoaId"
                name="pessoaId"
                placeholder="Selecione a pessoa"
                options={peoples}
                control={control}
                maxHeight="300px"
              />
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <Select
                label="Meio de pagamento"
                id="meioPagamentoId"
                name="meioPagamentoId"
                placeholder="Selecione o meio de pagamento"
                options={meansOfPayment}
                control={control}
                maxHeight="300px"
              />
              <Select
                label="Forma de pagamento"
                id="formaPagamento"
                name="formaPagamento"
                placeholder="Selecione a forma de pagamento"
                options={EnumsData?.data?.formaPagamento ?? []}
                control={control}
                maxHeight="300px"
              />
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <DatePicker
                dateFormat="dd/MM/yyyy"
                id="data"
                label="Data"
                name="data"
                control={control}
              />
              <Input
                label="Descrição"
                name="descricao"
                id="descricao"
                placeholder="Digite a descrição"
                control={control}
              />
            </Box>
            <Input
              label="Valor"
              name="valor"
              id="valor"
              placeholder="Digite o valor"
              control={control}
            />
            <Textarea
              label="Observações"
              name="observacoes"
              id="observacoes"
              placeholder="Digite as observações"
              lines={8}
              control={control}
            />
          </Box>
        </Card>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          gap="$2xs"
        >
          <Button
            type="button"
            appearance="danger"
            variant="outlined"
            onClick={() =>
              navigate(`${urlRouters.transactions}${currentSearch}`)
            }
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
