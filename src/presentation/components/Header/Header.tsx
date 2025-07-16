import React from "react";
import { Avatar, Box, Icon, IconButton } from "@rarui-react/components";
import { MenuIcon, UserFilledIcon } from "@rarui/icons";

import Logo from "@/presentation/assets/images/logo.svg?react";
import type { HeaderProps } from "./header.types";

const Header: React.FC<HeaderProps> = ({ handleMenu }) => (
  <Box
    as="header"
    role="header"
    height="70px"
    backgroundColor="$primary"
    display="flex"
    alignItems="center"
    borderBottomWidth="$1"
    borderStyle="solid"
    borderColor="$subdued"
    justifyContent="space-between"
    padding="$xs"
  >
    <Box display="flex" gap="$md" alignItems="center">
      <IconButton
        size="small"
        appearance="neutral"
        variant="outlined"
        source={<MenuIcon size="medium" />}
        onClick={handleMenu}
      />

      <Icon color="$brand" source={<Logo height={40} />} />
    </Box>
    <Box>
      <Avatar
        badge={{
          appearance: "danger",
          children: "2",
        }}
      >
        <Icon source={<UserFilledIcon />} />
      </Avatar>
    </Box>
  </Box>
);

export default Header;
