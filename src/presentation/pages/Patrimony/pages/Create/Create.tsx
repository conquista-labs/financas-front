import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Title } from "@rarui-react/components";

import { urlRouters } from "@/presentation/router/router.definitions";
import { Form } from "@/presentation/pages/Patrimony/components";
import { Breadcrumb } from "@/presentation/components";
import { usePostPatrimonio } from "@/presentation/hooks/api";
import { PostPatrimonioRequest } from "@/domain/usecases";

const Create: React.FC = () => {
  const { mutate, isPending } = usePostPatrimonio();
  const navigate = useNavigate();

  const handleSubmit = (data: PostPatrimonioRequest) => {
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
      <Breadcrumb crumbs={["patrimony", "createPatrimony"]} />
      <Title as="h4" color="$brand">
        Adicionar Patrimônio
      </Title>
      <Box width={{ xs: "100%", lg: "1110px" }}>
        <Form isPending={isPending} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default Create;
