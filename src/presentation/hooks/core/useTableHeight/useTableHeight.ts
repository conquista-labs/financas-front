import { useEffect, useState, useCallback } from "react";
import {
  UseTableHeightOptions,
  UseTableHeightReturn,
} from "./useTableHeight.types";

export const useTableHeight = ({
  baseOffset = 200, // Breadcrumb + padding + margins
  headerHeight = 120, // Page header with filters and buttons
  footerHeight = 60, // Table footer
  paginationHeight = 80, // Pagination controls
  rowHeight = 45, // Height of each table row
  minTableHeight = 300, // Minimum table height
}: UseTableHeightOptions = {}): UseTableHeightReturn => {
  const [dimensions, setDimensions] = useState({
    tableHeight: minTableHeight,
    maxVisibleRows: 8,
    availableHeight: 0,
  });

  const calculateDimensions = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const totalOffset =
      baseOffset + headerHeight + footerHeight + paginationHeight;
    const availableHeight = Math.max(
      viewportHeight - totalOffset,
      minTableHeight,
    );

    const tableHeight = Math.max(availableHeight, minTableHeight);

    // Calculate how many rows can fit in the available space
    // Subtract header row height (45px) from table height
    const availableRowSpace = tableHeight - 45;
    const maxVisibleRows = Math.max(
      Math.floor(availableRowSpace / rowHeight),
      5, // Always show at least 5 rows
    );

    setDimensions({
      tableHeight,
      maxVisibleRows,
      availableHeight,
    });
  }, [
    baseOffset,
    headerHeight,
    footerHeight,
    paginationHeight,
    rowHeight,
    minTableHeight,
  ]);

  useEffect(() => {
    calculateDimensions();

    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateDimensions]);

  return dimensions;
};
