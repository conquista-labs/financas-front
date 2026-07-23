import { Box } from "@rarui-react/components";
import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  marginBottom?: string;
  animation?: boolean;
}

export const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "8px",
  marginBottom,
  animation = true,
}: SkeletonProps) => {
  const baseStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    marginBottom,
  };
  const animationStyle: CSSProperties = animation
    ? {
        ...baseStyle,
        background:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "loading 1.5s infinite",
      }
    : { ...baseStyle, backgroundColor: "var(--track, #e0e0e0)" };

  return (
    <>
      {animation && (
        <style>
          {`
            @keyframes loading {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
          `}
        </style>
      )}
      <Box style={animationStyle} />
    </>
  );
};
