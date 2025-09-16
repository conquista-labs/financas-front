import { useEffect, useState, useCallback } from "react";
import {
  UseCalendarHeightOptions,
  UseCalendarHeightReturn,
} from "./useCalendarHeight.types";

export const useCalendarHeight = ({
  baseOffset = 200, // Breadcrumb + padding + margins
  headerHeight = 120, // Calendar header + weekdays
  minCellHeight = 80, // Minimum cell height
  transactionItemHeight = 20, // Height of each transaction item
  reservedCellHeight = 40, // Reserved space for day number and padding
}: UseCalendarHeightOptions = {}): UseCalendarHeightReturn => {
  const [dimensions, setDimensions] = useState({
    availableHeight: 0,
    cellHeight: minCellHeight,
    maxTransactionsPerCell: 2,
  });

  const calculateDimensions = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const availableHeight = Math.max(
      viewportHeight - baseOffset - headerHeight,
      300, // Minimum available height
    );

    // Calculate height for each row (5 rows in calendar)
    const rowHeight = availableHeight / 5;
    const cellHeight = Math.max(rowHeight, minCellHeight);

    // Calculate how many transactions can fit in each cell
    const availableSpaceForTransactions = cellHeight - reservedCellHeight;
    const maxTransactionsPerCell = Math.max(
      Math.floor(availableSpaceForTransactions / transactionItemHeight),
      1, // Always show at least 1 transaction
    );

    setDimensions({
      availableHeight,
      cellHeight,
      maxTransactionsPerCell,
    });
  }, [
    baseOffset,
    headerHeight,
    minCellHeight,
    transactionItemHeight,
    reservedCellHeight,
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
