import { Box, Icon, Text, Title } from "@rarui-react/components";
import React from "react";
import { CompactCardProps } from "./compactCard.types";

const CompactCard: React.FC<CompactCardProps> = ({
  title,
  value,
  color = "$primary",
  icon,
  iconColor = "$primary",
  subtitle,
  trend,
}) => (
  <Box
    backgroundColor="$primary"
    borderRadius="$xs"
    borderWidth="$1"
    borderStyle="solid"
    borderColor="$subdued"
    padding="$2xs"
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    minHeight="60px"
  >
    <Box display="flex" flexDirection="column" gap="$4xs" flex="1">
      <Text color="$secondary" fontSize="$xs">
        {title}
      </Text>
      <Title as="h6" color={color} fontSize="$m">
        {value}
      </Title>
      {subtitle && (
        <Box display="flex" alignItems="center" gap="$4xs">
          <Text color="$disabled" fontSize="$xxs">
            {subtitle}
          </Text>
          {trend && (
            <Text
              color={
                trend.type === "positive"
                  ? "$success"
                  : trend.type === "negative"
                    ? "$error"
                    : "$secondary"
              }
              fontSize="$xxs"
            >
              {trend.icon} {trend.value}
            </Text>
          )}
        </Box>
      )}
    </Box>

    {icon && (
      <Box
        backgroundColor="$secondary"
        width="36px"
        height="36px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="$pill"
        flexShrink="0"
      >
        <Icon color={iconColor} source={icon} />
      </Box>
    )}
  </Box>
);

export default CompactCard;
