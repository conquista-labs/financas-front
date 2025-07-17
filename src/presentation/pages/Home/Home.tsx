import React from "react";
import { Box, Title } from "@rarui-react/components";

const Home: React.FC = () => {
  return (
    <Box display="flex" height="100%" flexDirection="column" gap="$2xs">
      <Title as="h4" color="$primary" fontWeight="$bold">
        Bem vinda, Vivi
      </Title>
    </Box>
  );
};

export default Home;
