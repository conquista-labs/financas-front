import { ReactNode } from "react";
import type { BoxProps } from "@rarui-react/components";

export interface Column<T> {
  label: string;
  field: keyof T;
  options?: {
    boxProps?: Omit<BoxProps, "ref">;
    formatter?: (field: T[keyof T], row: T) => string | React.ReactNode;
    showNameColumnMobile?: boolean;
  };
}

export interface ColumnsDefinition<T> {
  setColum(
    label: string,
    field: keyof T,
    options?: Column<T>["options"],
  ): ColumnsDefinition<T>;

  getColumns(): Column<T>[];
}

export interface TableProps<T> {
  columns: ColumnsDefinition<T>;
  rows: T[];
  total: number;
  isLoading?: boolean;
  children?: ReactNode;
}
