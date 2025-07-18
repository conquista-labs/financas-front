import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Tooltip, Text } from "@rarui-react/components";

import type { MenuProps } from "./menu.types";
import { MENUS } from "../Template/template.definitions";

const Menu: React.FC<MenuProps> = () => {
  const { pathname } = useLocation();
  return (
    <Box
      as="menu"
      role="header"
      minHeight="calc(100dvh - 70px)"
      width="74px"
      backgroundColor="$primary"
      gap="$2xs"
      display={{ xs: "none", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      overflow="auto"
      borderRightWidth="$1"
      borderStyle="solid"
      borderColor="$subdued"
      paddingY="$3xs"
      boxSizing="border-box"
    >
      {MENUS.map((menu) => {
        const isMenuActive = pathname === menu.link;
        return (
          <Tooltip
            portalId="theme-provider"
            key={menu.id}
            arrow={false}
            enabledClick={false}
            offset={15}
            position="right"
            padding="none"
            content={
              <Box padding="$2xs">
                <Text fontSize="$xs" fontWeight="$semiBold" color="$primary">
                  {menu.title}
                </Text>
              </Box>
            }
          >
            <Box
              as={Link}
              to={menu.link}
              display="flex"
              height="40px"
              width="50px"
              alignItems="center"
              justifyContent="center"
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
            >
              {menu.icon}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default Menu;
