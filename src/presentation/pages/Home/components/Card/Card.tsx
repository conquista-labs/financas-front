import { Box } from "@rarui-react/components";
import React from "react";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    flex="1"
    backgroundColor="$primary"
    borderRadius="$xs"
    borderWidth="$1"
    borderStyle="solid"
    borderColor="$subdued"
    padding="$xs"
    display="flex"
    flexDirection="column"
    gap="$2xs"
  >
    {children}
  </Box>
);

export default Card;
