import React from "react";
import {
  Box,
  Divider,
  IconButton,
  Text,
  Sidebar as RaruiSidebar,
} from "@rarui-react/components";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuIcon } from "@rarui/icons";

import { MENUS } from "../Template/template.definitions";
import type { MenuProps } from "./sidebar.types";

const Sidebar: React.FC<MenuProps> = ({ handleMenu, open }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <RaruiSidebar
      position="left"
      padding="$none"
      open={open}
      onRemove={handleMenu}
      maxWidth={{ xs: "100%", md: "250px" }}
    >
      <Box display="flex" flexDirection="column" gap="$2xs">
        <Box display="flex" flexDirection="column" px="$xs" pt="$2xs">
          <IconButton
            size="small"
            appearance="neutral"
            variant="outlined"
            source={<MenuIcon size="medium" />}
            onClick={handleMenu}
          />
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" padding="$2xs" gap="$2xs">
          {MENUS.map((menu) => {
            const isMenuActive = pathname === menu.link;
            return (
              <Box
                key={menu.id}
                as="button"
                display="flex"
                height="40px"
                alignItems="center"
                justifyContent="flex-start"
                gap="$2xs"
                borderWidth="$none"
                cursor="pointer"
                transitionProperty="all"
                transitionTimingFunction="ease-in"
                borderRadius="$2xs"
                color={isMenuActive ? "$brand" : "$secondary"}
                backgroundColor={{
                  xs: isMenuActive ? "$secondary" : "$primary",
                  hover: "$brand-hover",
                }}
                onClick={() => {
                  navigate(menu.link);
                  handleMenu();
                }}
              >
                {menu.icon}
                <Text fontWeight="$semiBold">{menu.title}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </RaruiSidebar>
  );
};

export default Sidebar;
