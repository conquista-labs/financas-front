import { Box, Text } from "@rarui-react/components";

import LOGO from "@/presentation/assets/images/logo-zelo.svg";
import { type HeaderProps } from "./header.types";

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <>
    <Box mb="$4xl" width="100%">
      <img src={LOGO} alt="Zelo logo" />
    </Box>
    <Box display="flex" flexDirection="column" mb="$lg" width="100%" gap="$3xs">
      <Text fontWeight="$bold" fontSize="$xl" lineHeight="$xl">
        {title}
      </Text>
      <Text fontSize="$m" lineHeight="$m" color="$secondary">
        {subtitle}
      </Text>
    </Box>
  </>
);

export default Header;
