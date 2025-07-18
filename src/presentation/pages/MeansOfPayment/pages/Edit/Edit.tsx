import React from "react";
import { useParams } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";

import {
  useGetMeiosPagamentoId,
  usePatchMeiosPagamentoId,
} from "@/presentation/hooks/api";
import { Form } from "@/presentation/pages/MeansOfPayment/components";
import { Breadcrumb } from "@/presentation/components";

import type { PatchMeiosPagamentoIdRequest } from "@/domain/usecases";

const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useGetMeiosPagamentoId({ id: `${id}` });
  const { mutate, isPending } = usePatchMeiosPagamentoId({ id: `${id}` });

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["categories", "editCategories"]} />
      <Title as="h4" color="$brand">
        Editar categoria
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          defaultValues={response?.data}
          isPending={isLoading || isPending}
          onSubmit={(body: PatchMeiosPagamentoIdRequest) => mutate(body)}
        />
      </Box>
    </Box>
  );
};

export default Edit;
