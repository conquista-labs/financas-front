import React from "react";
import {
  Avatar,
  Box,
  Dropdown,
  Icon,
  IconButton,
  Toggle,
} from "@rarui-react/components";
import { useToast } from "@rarui-react/components/dist/Toast";
import {
  MenuIcon,
  UserFilledIcon,
  LightbulbFilledIcon,
  LightbulbOutlinedIcon,
  LogoutIcon,
} from "@rarui/icons";

import Logo from "@/presentation/assets/images/logo.svg?react";
import { useAuthStore } from "@/presentation/store";
import { usePostLogoutGoogle } from "@/presentation/hooks/api";
import { useTheme } from "@/App";
import type { HeaderProps } from "./header.types";
import { Loading } from "@/presentation/components";

const Header: React.FC<HeaderProps> = ({ handleMenu }) => {
  const { resetState, auth } = useAuthStore();
  const { setDarkMode, darkMode } = useTheme();
  const { mutate, isPending } = usePostLogoutGoogle();
  const { addToast } = useToast();

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
                color="$brand"
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
              onClick={() =>
                mutate(undefined, {
                  onSuccess: () => resetState(),
                  onError: (error) => {
                    addToast({
                      title: error.message,
                      appearance: "error",
                      variant: "solid",
                      duration: 4000,
                    });
                  },
                })
              }
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
            <Avatar size="large">
              {auth.user.avatar ? (
                <img
                  src={auth.user.avatar}
                  alt={auth.user.nome ?? "User Avatar"}
                  width="100%"
                  height="100%"
                />
              ) : (
                <Icon source={<UserFilledIcon />} />
              )}
            </Avatar>
          </Box>
        </Dropdown>
      </Box>
      <Loading isLoading={isPending} />
    </Box>
  );
};

export default Header;
