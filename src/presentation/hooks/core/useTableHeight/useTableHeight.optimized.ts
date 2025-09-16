import { useEffect, useState, useCallback, useRef } from "react";
import {
  UseTableHeightOptions,
  UseTableHeightReturn,
} from "./useTableHeight.types";

// Versão com throttling manual para casos extremos de performance
export const useTableHeightOptimized = ({
  baseOffset = 200,
  headerHeight = 120,
  footerHeight = 60,
  paginationHeight = 80,
  rowHeight = 45,
  minTableHeight = 300,
  throttleMs = 100, // Throttle resize events
}: UseTableHeightOptions & {
  throttleMs?: number;
} = {}): UseTableHeightReturn => {
  const [dimensions, setDimensions] = useState({
    tableHeight: minTableHeight,
    maxVisibleRows: 8,
    availableHeight: 0,
  });

  const throttleRef = useRef<NodeJS.Timeout>();

  const calculateDimensions = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const totalOffset =
      baseOffset + headerHeight + footerHeight + paginationHeight;
    const availableHeight = Math.max(
      viewportHeight - totalOffset,
      minTableHeight,
    );

    const tableHeight = Math.max(availableHeight, minTableHeight);
    const availableRowSpace = tableHeight - 45;
    const maxVisibleRows = Math.max(
      Math.floor(availableRowSpace / rowHeight),
      5,
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
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      throttleRef.current = setTimeout(() => {
        calculateDimensions();
      }, throttleMs);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [calculateDimensions, throttleMs]);

  return dimensions;
};
