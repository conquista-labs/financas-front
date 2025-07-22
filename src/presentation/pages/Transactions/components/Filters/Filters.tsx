import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  IconButton,
  Sidebar,
  Title,
} from "@rarui-react/components";

import { useIsMobile } from "@/presentation/hooks/core";
import { Select } from "@/presentation/components";

import { buildOptions, defaultForm, schema } from "./filters.definitions";
import {
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";
import { useMemo } from "react";
import { CloseIcon } from "@rarui/icons";
import { FiltersProps } from "./filter.types";
import { StringParam, useQueryParams, withDefault } from "use-query-params";

const Filters: React.FC<FiltersProps> = ({ open, onRemove }) => {
  const [param, setParam] = useQueryParams({
    categoriaId: withDefault(StringParam, ""),
    pessoaId: withDefault(StringParam, ""),
    meioPagamentoId: withDefault(StringParam, ""),
    formaPagamento: withDefault(StringParam, ""),
  });

  const { isMobile } = useIsMobile();
  const { data: EnumsData } = useGetEnums({ enabled: open });
  const { data: categoriesData } = useGetCategorias(
    { page: 1, limit: 50 },
    { enabled: open },
  );
  const { data: peoplesData } = useGetPessoas(
    { page: 1, limit: 50 },
    { enabled: open },
  );
  const { data: meansOfPaymentData } = useGetMeiosPagamento(
    {
      page: 1,
      limit: 50,
    },
    { enabled: open },
  );

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...param },
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

  const onSubmit = (data: any) => {
    setParam(data);
    onRemove?.();
  };

  const onReset = () => {
    setParam({}, "push");
  };

  return (
    <Sidebar
      open={open}
      onRemove={onRemove}
      position="right"
      padding="$medium"
      zIndex="$900"
      id="sidebar-filters-transactions"
    >
      <Box display="flex" flexDirection="column" gap="$md" width="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Title as="h6">Filtrar por</Title>
          <IconButton
            onClick={onRemove}
            variant="ghost"
            source={<CloseIcon />}
            size="small"
          />
        </Box>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap="$s"
        >
          <Select
            label="Categoria"
            id="categoriaId"
            name="categoriaId"
            placeholder="Selecione a categoria"
            options={categories}
            control={control}
            maxHeight="300px"
            portalId="sidebar-filters-transactions"
          />
          <Select
            label="Pessoa"
            id="pessoaId"
            name="pessoaId"
            placeholder="Selecione a pessoa"
            options={peoples}
            control={control}
            maxHeight="300px"
            portalId="sidebar-filters-transactions"
          />

          <Select
            label="Meio de pagamento"
            id="meioPagamentoId"
            name="meioPagamentoId"
            placeholder="Selecione o meio de pagamento"
            options={meansOfPayment}
            control={control}
            maxHeight="300px"
            portalId="sidebar-filters-transactions"
          />
          <Select
            label="Forma de pagamento"
            id="formaPagamento"
            name="formaPagamento"
            placeholder="Selecione a forma de pagamento"
            options={[
              { value: "", label: "" },
              ...(EnumsData?.data?.formaPagamento ?? []),
            ]}
            control={control}
            maxHeight="300px"
            portalId="sidebar-filters-transactions"
          />
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
              onClick={onReset}
              full={isMobile}
            >
              Limpar
            </Button>
            <Button full={isMobile}>Filtrar</Button>
          </Box>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default Filters;
