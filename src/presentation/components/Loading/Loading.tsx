import { Box, Text } from "@rarui-react/components";
import React from "react";

import { type LoadingProps } from "./loading.types";

const Loading: React.FC<LoadingProps> = ({ isLoading }) => (
  <>
    {/* Criar componente Loading */}
    {isLoading && (
      <Box data-testid="loading-spinner">
        <Text>Loading</Text>
      </Box>
    )}
  </>
);

export default Loading;
