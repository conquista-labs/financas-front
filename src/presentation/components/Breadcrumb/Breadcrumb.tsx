import React from "react";
import { Link } from "react-router-dom";
import {
  Icon,
  Box,
  Breadcrumb as RaruiBreadcrumb,
} from "@rarui-react/components";
import { HomeFilledIcon } from "@rarui/icons";

import { urlRouters } from "@/presentation/router/router.definitions";
import { crumbsMapper } from "./breadcrumb.definitions";
import type { BreadcrumbProps } from "./breadcrumb.types";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs = [] }) => {
  const lastIndex = crumbs.length - 1;

  return (
    <Box width="100%">
      <RaruiBreadcrumb aria-label="Navegação por migalhas">
        <RaruiBreadcrumb.Item
          as={Link}
          to={urlRouters.root}
          active={crumbs.length === 0}
        >
          <Icon color="$primary" source={<HomeFilledIcon />} />
          Início
        </RaruiBreadcrumb.Item>

        {crumbs.map((crumb, index) => {
          const item = crumbsMapper[crumb];
          if (!item) return null;

          return (
            <RaruiBreadcrumb.Item
              key={crumb}
              as={Link}
              to={item.link}
              active={index === lastIndex}
            >
              {item.label}
            </RaruiBreadcrumb.Item>
          );
        })}
      </RaruiBreadcrumb>
    </Box>
  );
};

export default Breadcrumb;
