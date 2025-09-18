import React from "react";
import type { TitleProps, IconProps } from "@rarui-react/components";

export interface TrendData {
  type: "positive" | "negative" | "neutral";
  value: string;
  icon: string;
}

export interface CompactCardProps {
  title: string;
  value: string;
  color?: TitleProps["color"];
  icon?: React.ReactNode;
  iconColor?: IconProps["color"];
  subtitle?: string;
  trend?: TrendData;
}
