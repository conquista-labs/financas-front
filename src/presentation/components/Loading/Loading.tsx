import React from "react";
import { Box, Icon } from "@rarui-react/components";

import Logo from "@/presentation/assets/images/short_logo.svg?react";

import { type LoadingProps } from "./loading.types";
import "./loading.css";

const Loading: React.FC<LoadingProps> = ({ isLoading }) => (
  <>
    {isLoading && (
      <Box
        data-testid="loading-spinner"
        position="fixed"
        top="0px"
        bottom="0px"
        left="0px"
        right="0px"
        backgroundColor="$overlay"
        zIndex="$900"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon color="$invert" source={<Logo />} />
      </Box>
    )}
  </>
);

export default Loading;
