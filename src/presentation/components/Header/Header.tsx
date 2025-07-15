import React from "react";
import { Avatar, Box, Icon, IconButton } from "@rarui-react/components";
import { MenuIcon, UserFilledIcon } from "@rarui/icons";
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
    <Box>
      <IconButton
        size="small"
        appearance="neutral"
        variant="outlined"
        source={<MenuIcon size="medium" />}
        onClick={handleMenu}
      />
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
