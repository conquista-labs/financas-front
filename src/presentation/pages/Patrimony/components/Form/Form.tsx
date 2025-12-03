import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, Card, Text } from "@rarui-react/components";
import { useNavigate } from "react-router-dom";

import { urlRouters } from "@/presentation/router/router.definitions";
import { useIsMobile } from "@/presentation/hooks/core";
import {
  DatePicker,
  Input,
  InputCurrency,
  Loading,
  Select,
  Textarea,
} from "@/presentation/components";
import { useGetEnums, useGetPessoas } from "@/presentation/hooks/api";
import { Patrimonio } from "@/domain/models";

import { buildPessoasOptions, defaultForm, schema } from "./form.definitions";
import type { FormProps } from "./form.types";

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit, isPending }) => {
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();

  const { handleSubmit, watch, control } = useForm({
    resolver: yupResolver(schema),
    values: { ...defaultForm, ...defaultValues },
    mode: "onChange",
  });

  const { data: pessoasData } = useGetPessoas({ page: 1, limit: 50 });
  const { data: enumsData } = useGetEnums();

  const tipo = watch("tipo");
  const isPassivo = tipo === Patrimonio.TipoEnum.Passivo;

  // Opções de tipo e categoria vindas do backend
  const tipoPatrimonioOptions = useMemo(
    () => enumsData?.data?.tipoPatrimonioEnum ?? [],
    [enumsData?.data?.tipoPatrimonioEnum],
  );

  const categoriasOptions = useMemo(
    () => enumsData?.data?.categoriaPatrimonio ?? [],
    [enumsData?.data?.categoriaPatrimonio],
  );

  const pessoas = useMemo(
    () => buildPessoasOptions(pessoasData?.data?.rows ?? []),
    [pessoasData?.data?.rows],
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
            {/* Tipo e Categoria */}
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <Select
                id="tipo"
                label="Tipo"
                name="tipo"
                placeholder="Selecione o tipo"
                control={control}
                options={tipoPatrimonioOptions}
              />
              <Select
                label="Categoria"
                id="categoria"
                name="categoria"
                placeholder="Selecione a categoria"
                options={categoriasOptions}
                control={control}
                maxHeight="300px"
              />
            </Box>

            {/* Descrição */}
            <Input
              label="Descrição"
              name="descricao"
              id="descricao"
              placeholder="Ex: Apartamento Centro, Fiat Uno 2020"
              control={control}
            />

            {/* Valores */}
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <InputCurrency
                label="Valor Atual"
                name="valorAtual"
                id="valorAtual"
                placeholder="Digite o valor atual"
                control={control}
                leadingStart={<Text>R$</Text>}
              />
              <InputCurrency
                label="Valor Inicial (opcional)"
                name="valorInicial"
                id="valorInicial"
                placeholder="Digite o valor inicial"
                control={control}
                leadingStart={<Text>R$</Text>}
              />
            </Box>

            {/* Data de Aquisição e Pessoa */}
            <Box
              width="100%"
              display="flex"
              flexDirection={{ xs: "column", lg: "row" }}
              gap={{ xs: "$s", lg: "$2xs" }}
            >
              <DatePicker
                dateFormat="dd/MM/yyyy"
                id="dataAquisicao"
                label="Data de Aquisição"
                name="dataAquisicao"
                control={control}
              />
              <Select
                label="Pessoa (opcional)"
                id="pessoaId"
                name="pessoaId"
                placeholder="Selecione a pessoa"
                options={pessoas}
                control={control}
                maxHeight="300px"
              />
            </Box>

            {/* Campos específicos para PASSIVOS */}
            {isPassivo && (
              <>
                <Box
                  width="100%"
                  padding="$s"
                  backgroundColor="$error-subdued"
                  borderRadius="$md"
                >
                  <Text fontSize="$xs" fontWeight="$bold" color="$error">
                    Campos Específicos de Passivo
                  </Text>
                </Box>

                <Box
                  width="100%"
                  display="flex"
                  flexDirection={{ xs: "column", lg: "row" }}
                  gap={{ xs: "$s", lg: "$2xs" }}
                >
                  <InputCurrency
                    label="Saldo Devedor"
                    name="saldoDevedor"
                    id="saldoDevedor"
                    placeholder="Digite o saldo devedor"
                    control={control}
                    leadingStart={<Text>R$</Text>}
                  />
                  <Input
                    label="Taxa de Juros (% a.m.)"
                    name="taxaJuros"
                    id="taxaJuros"
                    type="number"
                    placeholder="Ex: 0.8"
                    control={control}
                  />
                </Box>

                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  id="dataVencimento"
                  label="Data de Vencimento (opcional)"
                  name="dataVencimento"
                  control={control}
                />
              </>
            )}

            {/* Observações */}
            <Textarea
              label="Observações (opcional)"
              name="observacoes"
              id="observacoes"
              placeholder="Digite observações adicionais"
              lines={4}
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
            onClick={() => navigate(urlRouters.patrimony)}
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
