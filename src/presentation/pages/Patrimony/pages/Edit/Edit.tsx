import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";
import {
  useGetPatrimonioId,
  usePatchPatrimonioId,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
import { Form } from "@/presentation/pages/Patrimony/components";
import { Breadcrumb } from "@/presentation/components";
import { PatchPatrimonioIdRequest } from "@/domain/usecases";

const Edit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetPatrimonioId({ id: `${id}` });
  const { mutate, isPending } = usePatchPatrimonioId({ id: `${id}` });

  const handleSubmit = (data: PatchPatrimonioIdRequest) => {
    mutate(data, {
      onSuccess: () => {
        navigate(urlRouters.patrimony);
      },
    });
  };

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      gap="$2xs"
      alignItems="center"
    >
      <Breadcrumb crumbs={["patrimony", "editPatrimony"]} />
      <Title as="h4" color="$brand">
        Editar Patrimônio
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form
          defaultValues={response?.data}
          isPending={isPending || isLoading}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default Edit;
