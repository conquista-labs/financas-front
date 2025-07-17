import { Box, Icon, Text } from "@rarui-react/components";

import Logo from "@/presentation/assets/images/logo.svg?react";
import { type HeaderProps } from "./header.types";

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <>
    <Box mb="$lg" width="100%">
      <Icon color="$brand" source={<Logo />} />
    </Box>
    <Box display="flex" flexDirection="column" mb="$lg" width="100%" gap="$3xs">
      <Text color="$primary" fontWeight="$bold" fontSize="$xl" lineHeight="$xl">
        {title}
      </Text>
      <Text fontSize="$m" lineHeight="$m" color="$secondary">
        {subtitle}
      </Text>
    </Box>
  </>
);

export default Header;
