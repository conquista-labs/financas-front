import React from "react";
import { Box, Divider, Title } from "@rarui-react/components";
import BANNER_LOGIN from "@/presentation/assets/images/banner.png";

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
    backgroundPosition="right"
    width="50%"
    maxWidth="730px"
    gap="$s"
    padding="$xl"
    pr="$none"
  >
    <Box width="384px">
      <Title as="h2" color="$on-brand" fontSize="$xl" fontWeight="$regular">
        Cuidar do que é nosso, todos os dias!
      </Title>
    </Box>
    <Divider color="$invert" thickness="$2" />
  </Box>
);

export default Banner;
