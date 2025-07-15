import { Box, Button, Text, Title } from "@rarui-react/components";
import { useNavigate } from "react-router-dom";

import { urlRouters } from "@/presentation/router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(urlRouters.root);
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      margin={"$auto"}
      height={"100dvh"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        marginBottom={"$md"}
        gap={"$md"}
      >
        <Title as="h1" color="$brand" textAlign={"center"}>
          404
        </Title>
        <Text
          color="$brand"
          textAlign={"center"}
          fontSize={"$l"}
          fontWeight={"$bold"}
        >
          Desculpe, não conseguimos encontrar essa página.
        </Text>
        <Text
          fontWeight={"$regular"}
          lineHeight={"$m"}
          color={"$secondary"}
          textAlign={"center"}
        >
          A página que você procura não existe ou foi movida para outro
          endereço!
        </Text>
        <Button onClick={handleGoHome}>Voltar à página inicial</Button>
      </Box>
    </Box>
  );
};

export default NotFound;
