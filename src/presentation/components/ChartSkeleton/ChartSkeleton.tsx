import { Box } from "@rarui-react/components";
import { Skeleton } from "../Skeleton";

interface ChartSkeletonProps {
  height?: string;
  showLegend?: boolean;
  showTitle?: boolean;
  type?: "bar" | "line" | "pie";
}

export const ChartSkeleton = ({
  height = "200px",
  showLegend = true,
  showTitle = true,
  type = "bar",
}: ChartSkeletonProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="$s"
      width="100%"
      height={height}
      padding="$s"
    >
      {/* Título do gráfico */}
      {showTitle && (
        <Box marginBottom="$xs">
          <Skeleton height="20px" width="60%" borderRadius="$xs" />
        </Box>
      )}

      {/* Área principal do gráfico */}
      <Box
        flex="1"
        display="flex"
        alignItems="flex-end"
        justifyContent="space-around"
        gap="$xs"
        backgroundColor="$background"
        borderRadius="$s"
        padding="$s"
      >
        {type === "bar" && (
          // Barras do gráfico
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="$xs"
              >
                <Skeleton
                  width="20px"
                  height={`${Math.random() * 60 + 40}%`}
                  borderRadius="$xs"
                />
                <Skeleton width="30px" height="12px" borderRadius="$xs" />
              </Box>
            ))}
          </>
        )}

        {type === "line" && (
          <Box width="100%" height="100%" position="relative">
            <Skeleton width="100%" height="100%" borderRadius="$s" />
            {/* Pontos da linha */}
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                position="absolute"
                left={`${index * 16 + 10}%`}
                top={`${Math.random() * 60 + 20}%`}
              >
                <Skeleton width="8px" height="8px" borderRadius="50%" />
              </Box>
            ))}
          </Box>
        )}

        {type === "pie" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
          >
            <Skeleton width="120px" height="120px" borderRadius="50%" />
          </Box>
        )}
      </Box>

      {/* Legenda */}
      {showLegend && (
        <Box display="flex" gap="$s" justifyContent="center" flexWrap="wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <Box key={index} display="flex" alignItems="center" gap="$xs">
              <Skeleton width="12px" height="12px" borderRadius="$xs" />
              <Skeleton width="50px" height="12px" borderRadius="$xs" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
