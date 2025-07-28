import React, { useMemo } from "react";
import {
  Box,
  Title,
  Text,
  Datepicker,
  IconButton,
} from "@rarui-react/components";
import {
  useGetResumoFinanceiro,
  usePostResumoFinanceiro,
} from "@/presentation/hooks/api";

import { useAuthStore } from "@/presentation/store";
import {
  ResumoMensalTable,
  ResumoFinanceiroChart,
  ResumoPorCategoriaTable,
  Card,
  Header,
} from "./components";
import { formatCurrency } from "./home.definitions";
import { Loading } from "@/presentation/components";
import { ArrowLeftIcon, ArrowRightIcon } from "@rarui/icons";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { addYears, subYears, format } from "date-fns";

const Home: React.FC = () => {
  const [year, setYear] = useQueryParam(
    "year",
    withDefault(StringParam, format(new Date(), "yyyy")),
  );

  const { auth } = useAuthStore();
  const {
    data,
    isLoading: loadingResumo,
    refetch,
  } = useGetResumoFinanceiro({ ano: Number(year) });
  const { mutate, isPending } = usePostResumoFinanceiro();

  const isLoading = useMemo(
    () => loadingResumo || isPending,
    [loadingResumo, isPending],
  );

  const resumo = data?.data;
  const receitasMes = resumo?.receitasMes ?? [];
  const despesasMes = resumo?.despesasMes ?? [];
  const receitasAno = resumo?.receitasAno ?? 0;
  const despesasAno = resumo?.despesasAno ?? 0;

  const handleAtualizar = () =>
    mutate({ year: Number(year) }, { onSuccess: () => refetch() });

  const navigateYear = (direction: "prev" | "next") => {
    const operator = direction === "next" ? addYears : subYears;
    const date = new Date(Number(year), 0);
    const newYear = format(operator(date!, 1), "yyyy");
    setYear(newYear);
  };

  const handleYearChange = (date: Date) => {
    setYear(format(date, "yyyy"));
  };

  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$s" pb="$xl">
      <Header
        nome={auth.nome}
        atualizadoEm={resumo?.atualizadoEm}
        onAtualizar={handleAtualizar}
      />

      <Box display="flex" justifyContent="flex-start">
        <Box
          display="flex"
          alignItems="center"
          gap="$2xs"
          width={{ xs: "100%", md: "300px" }}
        >
          <IconButton
            source={<ArrowLeftIcon size="medium" />}
            onClick={() => navigateYear("prev")}
          />
          <Datepicker
            dateFormat="yyyy"
            showYearPicker
            selected={new Date(Number(year), 0)}
            onChange={(date) => handleYearChange(date as Date)}
          />
          <IconButton
            source={<ArrowRightIcon size="medium" />}
            onClick={() => navigateYear("next")}
          />
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap="$s"
      >
        <Card>
          <Text color="$secondary">Total de receitas do ano</Text>
          <Title as="h6" color="$success">
            {formatCurrency(receitasAno)}
          </Title>
        </Card>
        <Card>
          <Text color="$secondary">Total de despesas do ano</Text>
          <Title as="h6" color="$error">
            {formatCurrency(despesasAno)}
          </Title>
        </Card>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
        gap="$s"
      >
        <Card>
          <ResumoFinanceiroChart
            receitasMes={receitasMes}
            despesasMes={despesasMes}
          />
        </Card>
        <Card>
          <ResumoMensalTable
            receitasMes={receitasMes}
            despesasMes={despesasMes}
            receitasAno={receitasAno}
            despesasAno={despesasAno}
          />
        </Card>
      </Box>
      <Card>
        <ResumoPorCategoriaTable
          despesasPorCategoriaAno={resumo?.despesasPorCategoriaAno ?? []}
          despesasPorCategoriaMes={resumo?.despesasPorCategoriaMes ?? []}
        />
      </Card>
      <Loading isLoading={isLoading} />
    </Box>
  );
};

export default Home;
