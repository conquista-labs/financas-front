import type { ColumnsDefinition, Column } from "./table.types";

export class ColumnsDefinitions<T> implements ColumnsDefinition<T> {
  private columns: Column<T>[] = [];

  setColum(
    label: string,
    field: keyof T,
    options?: Column<T>["options"],
  ): ColumnsDefinition<T> {
    this.columns.push({ label, field, options });
    return this;
  }

  getColumns(): Column<T>[] {
    return this.columns;
  }
}

export const pageSizeOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "25", value: "25" },
];
