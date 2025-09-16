export interface UseCalendarHeightReturn {
  /**
   * Available height for the calendar grid in pixels
   */
  availableHeight: number;
  /**
   * Height for each calendar cell based on available space
   */
  cellHeight: number;
  /**
   * Maximum number of transactions that can be displayed per cell
   */
  maxTransactionsPerCell: number;
}

export interface UseCalendarHeightOptions {
  /**
   * Base padding and margins around the calendar
   */
  baseOffset?: number;
  /**
   * Height of calendar header (navigation + weekdays)
   */
  headerHeight?: number;
  /**
   * Minimum height for each calendar cell
   */
  minCellHeight?: number;
  /**
   * Height of each transaction item
   */
  transactionItemHeight?: number;
  /**
   * Height reserved for day number and padding
   */
  reservedCellHeight?: number;
}
