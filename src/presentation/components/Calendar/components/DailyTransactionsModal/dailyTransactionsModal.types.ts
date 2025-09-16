import type { DiaCalendario } from "@/domain/models";

export interface DailyTransactionsModalProps {
  /**
   * Whether the modal is open or not
   */
  open: boolean;
  /**
   * Callback fired when the modal should be closed
   */
  onClose: () => void;
  /**
   * Data of the selected day with transactions
   */
  dayData: DiaCalendario | null;
}
