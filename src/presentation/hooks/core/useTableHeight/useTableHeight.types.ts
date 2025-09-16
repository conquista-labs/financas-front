export interface UseTableHeightOptions {
  baseOffset?: number;
  headerHeight?: number;
  footerHeight?: number;
  paginationHeight?: number;
  rowHeight?: number;
  minTableHeight?: number;
}

export interface UseTableHeightReturn {
  tableHeight: number;
  maxVisibleRows: number;
  availableHeight: number;
}
