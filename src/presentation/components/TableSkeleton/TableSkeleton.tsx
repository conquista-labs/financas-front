import { Box } from "@rarui-react/components";
import { Skeleton } from "../Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="$xs"
      width="100%"
      padding="$s"
    >
      {/* Header da tabela */}
      {showHeader && (
        <Box display="flex" gap="$s" marginBottom="$xs">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box key={colIndex} flex="1">
              <Skeleton
                height="20px"
                width={colIndex === 0 ? "80%" : "60%"}
                borderRadius="$xs"
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Linhas da tabela */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          display="flex"
          gap="$s"
          alignItems="center"
          padding="$xs"
          borderRadius="$xs"
          backgroundColor="$background"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box key={colIndex} flex="1">
              <Skeleton
                height="16px"
                width={
                  colIndex === 0
                    ? "70%"
                    : colIndex === columns - 1
                      ? "50%"
                      : "80%"
                }
                borderRadius="$xs"
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
