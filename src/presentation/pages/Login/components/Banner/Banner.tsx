import React from "react";
import { Box, Divider, Title } from "@rarui-react/components";
import BANNER_LOGIN from "@/presentation/assets/images/banner_login.png";

const Banner: React.FC = () => (
  <Box
    data-testid="banner-box"
    display={{ xs: "none", md: "flex" }}
    justifyContent="center"
    alignItems="flex-start"
    flexDirection="column"
    backgroundImage={`url(${BANNER_LOGIN})`}
    backgroundRepeat="no-repeat"
    backgroundSize="cover"
    backgroundColor="$brand"
    width="50%"
    maxWidth="730px"
    gap="$s"
    padding="$xl"
    pr="$none"
  >
    <Box width="384px">
      <Title color="$on-brand" fontSize="$hero" fontWeight="$regular">
        Essencial é viver bem
      </Title>
    </Box>
    <Divider color="$invert" thickness="$2" />
  </Box>
);

export default Banner;
