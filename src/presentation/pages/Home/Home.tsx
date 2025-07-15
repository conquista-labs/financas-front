import { Box, Title } from "@rarui-react/components";
import React from "react";

const Home: React.FC = () => {
  return (
    <Box display="flex" height="100%" flexDirection="column">
      <Title as="h4" fontWeight="$bold">
        Bem vinda, Vivi
      </Title>
    </Box>
  );
};

export default Home;
