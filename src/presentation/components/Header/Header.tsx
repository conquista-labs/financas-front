import React from "react";
import {
  Avatar,
  Box,
  Dropdown,
  Icon,
  IconButton,
  Toggle,
} from "@rarui-react/components";
import {
  MenuIcon,
  UserFilledIcon,
  LightbulbFilledIcon,
  LightbulbOutlinedIcon,
  LogoutIcon,
} from "@rarui/icons";

import Logo from "@/presentation/assets/images/logo.svg?react";
import type { HeaderProps } from "./header.types";
import { useAuthStore } from "@/presentation/store";
import { useTheme } from "@/App";

const Header: React.FC<HeaderProps> = ({ handleMenu }) => {
  const { resetState } = useAuthStore();
  const { setDarkMode, darkMode } = useTheme();

  const handleDarkTheme = () => {
    localStorage.setItem("dark-theme", `${!darkMode}`);
    setDarkMode(!darkMode);
  };

  return (
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
      <Box display="flex" gap="$2xs" alignItems="center">
        <Toggle
          name="dark-mode"
          checked={!darkMode}
          onClick={handleDarkTheme}
          readOnly
          icons={{
            checked: (
              <Icon
                color="$primary"
                source={<LightbulbFilledIcon size="small" />}
              />
            ),
            unchecked: (
              <Icon
                color="$invert"
                source={<LightbulbOutlinedIcon size="small" />}
              />
            ),
          }}
          size="large"
        />
        <Dropdown
          content={
            <Dropdown.Item
              as="button"
              onClick={resetState}
              icon={<LogoutIcon />}
              name="Sair"
            />
          }
        >
          <Box
            as="button"
            cursor="pointer"
            padding="$none"
            borderWidth="$none"
            backgroundColor="$transparent"
          >
            <Avatar
              badge={{
                appearance: "danger",
                children: "2",
              }}
            >
              <Icon source={<UserFilledIcon />} />
            </Avatar>
          </Box>
        </Dropdown>
      </Box>
    </Box>
  );
};

export default Header;
