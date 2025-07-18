import { Box } from "@rarui-react/components";
import React from "react";

import { Banner, Header, Form } from "./components";

const Login: React.FC = () => {
  return (
    <Box minHeight="100vh" backgroundColor="$primary">
      <Box
        display="flex"
        alignItems="stretch"
        minHeight="100vh"
        flexDirection={{ md: "row-reverse" }}
      >
        <Banner />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={{ xs: "100%", md: "50%" }}
          flex="1"
          backgroundColor="$primary"
        >
          <Box width="360px">
            <Header
              title="Bem-vindos de volta!"
              subtitle="Faça login para gerenciar seus gastos e acompanhar suas finanças."
            />
            <Form />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
